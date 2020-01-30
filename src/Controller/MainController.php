<?php

/**
 * Copyright 2019-2020 Douglas Silva (0x9fd287d56ec107ac)
 *
 * This file is part of KaBuM!.
 *
 * KaBuM! is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KaBuM!.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Serializer\SerializerInterface;
use Knp\Component\Pager\PaginatorInterface;
use App\Repository\ProductRepository;
use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Entity\Category;
use App\Service\ShoppingCartStorage;

class MainController extends AbstractController
{
    /**
     * @param ProductRepository $repository
     *
     * @return Response
     *
     * @Route("/", name="main_page")
     */
    public function mainPage(ProductRepository $repository): Response
    {
        $products = $repository->findAll();

        return $this->render('main/index.html.twig', [
            'products' => $products,
        ]);
    }

    /**
     * @param Product $product
     *
     * @return Response
     *
     * @Route("/produto/{slug}", name="product_page")
     */
    public function productPage(Product $product): Response
    {
        return $this->render('main/product.html.twig', [
            'product' => $product,
        ]);
    }

    /**
     * @param Request $request
     * @param Category $category
     * @param PaginatorInterface $paginator
     *
     * @return Response
     *
     * @Route("/categoria/{category_slug}", name="category_page", options={"expose"=true})
     * @ParamConverter("category", options={"mapping": {"category_slug": "slug"}})
     */
    public function categoryPage(Request $request, Category $category, PaginatorInterface $paginator): Response
    {
        if ($request->isXmlHttpRequest()) {
            $products = $category->getProducts();
            $pagination = $paginator->paginate($products, $request->query->getInt('page', 1), 2);

            return $this->render('main/_products.html.twig', [
                'pagination' => $pagination,
            ]);
        }

        return $this->render('main/category.html.twig', [
            'category' => $category,
        ]);
    }

    /**
     * Retrieve all categories.
     *
     * This is meant to be called with an Ajax request.
     *
     * @param CategoryRepository $repository
     *
     * @return JsonResponse
     *
     * @Route("/categorias", name="get_categories", condition="request.isXmlHttpRequest()")
     */
    public function getCategories(CategoryRepository $repository, SerializerInterface $serializer): JsonResponse
    {
        $categories = $repository->findAll();

        // Prepare the data to be returned in a JSON response
        $jsonData = $serializer->serialize($categories, 'json', [
            'attributes' => ['name', 'slug']
        ]);

        /*
         * Returning the processed data within an associative array mitigates
         * a JSON Hijacking vulnerability.
         */
        return JsonResponse::fromJsonString('{"categories": ' . $jsonData . '}');
    }

    /**
     * @param Request $request
     * @param ProductRepository $repository
     *
     * @return Response
     *
     * @Route("/pesquisa", name="search")
     */
    public function search(Request $request, ProductRepository $repository): Response
    {
        $query = $request->query->get('query', '');

        if ($request->isXmlHttpRequest()) {
            $page = $request->query->get('page', 1);

            $pagination = $repository->findBySearchQuery($query, $page, 2);

            return $this->render('main/_products.html.twig', [
                'pagination' => $pagination,
            ]);
        }

        return $this->render('main/search.html.twig', [
            'query' => $query,
        ]);
    }

    /**
     * Performs a search for products and returns the requested number of results.
     *
     * This controller is meant to be used by the instant search script,
     * and can only be accessed through an AJAX request.
     *
     * @param Request $request
     * @param ProductRepository $repository
     *
     * @return Response
     *
     * @Route("/pesquisa/instantanea", name="instant_search", condition="request.isXmlHttpRequest()")
     */
    public function instantSearch(Request $request, ProductRepository $repository): Response
    {
        $query = $request->query->get('query', '');

        $products = $repository->findByInstantSearchQuery($query);

        return $this->render('main/_instant_search_products.html.twig', [
            'products' => $products,
        ]);
    }

    /**
     * Add a product to the shopping cart.
     *
     * @param Request $request
     * @param Product $product
     * @param ShoppingCartStorage $storage
     *
     * @return Response
     *
     * @Route("/carrinho/adicionar/{id}", methods={"POST"}, name="add_to_cart")
     */
    public function addToCart(Request $request, Product $product, ShoppingCartStorage $storage): Response
    {
        if (!$this->isCsrfTokenValid('add-to-cart', $request->request->get('token'))) {
            return $this->redirectToRoute('main_page');
        }

        $storage->add($product);

        $this->addFlash(
            'kabum-light-blue',
            'product_added_to_cart'
        );

        return $this->redirectToRoute('shopping_cart');
    }

    /**
     * Remove a product from the shopping cart.
     *
     * @param Request $request
     * @param Product $product
     * @param ShoppingCartStorage $storage
     *
     * @return Response
     *
     * @Route("/carrinho/remover/{id}", methods={"POST"}, name="remove_from_cart")
     */
    public function removeFromCart(Request $request, Product $product, ShoppingCartStorage $storage): Response
    {
        if (!$this->isCsrfTokenValid('remove-from-cart', $request->request->get('token'))) {
            return $this->redirectToRoute('main_page');
        }

        $storage->remove($product);

        $this->addFlash(
            'kabum-light-blue',
            'product_removed_from_cart'
        );

        return $this->redirectToRoute('shopping_cart');
    }

    /**
     * List all products on the shopping cart.
     *
     * @param Request $request
     * @param ShoppingCartStorage $storage
     *
     * @return Response
     *
     * @Route("/carrinho", name="shopping_cart")
     */
    public function shoppingCart(Request $request, ShoppingCartStorage $storage): Response
    {
        $cart = $storage->all();

        return $this->render('main/shopping_cart.html.twig', [
            'cart' => $cart,
        ]);
    }
}
