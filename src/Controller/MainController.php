<?php

/**
 * Copyright 2019 Douglas Silva (0x9fd287d56ec107ac)
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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Knp\Component\Pager\PaginatorInterface;
use App\Repository\ProductRepository;
use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Entity\Category;

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
     * @Route("/categoria/{slug}", name="category_page")
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
     * This controller is meant to be embedded on templates.
     *
     * @param CategoryRepository $repository
     *
     * @return Response
     */
    public function categoryList(CategoryRepository $repository): Response
    {
        $categories = $repository->findAll();

        return $this->render('main/_categories.html.twig', [
            'categories' => $categories,
        ]);
    }
}
