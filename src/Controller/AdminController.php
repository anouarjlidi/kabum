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

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\File;
use App\Service\FileUploader;
use App\Entity\Product;
use App\Form\Type\ProductType;
use App\Form\Model\ProductFormModel;
use App\Repository\ProductRepository;
use App\Entity\Category;
use App\Form\Type\CategoryType;
use App\Form\Model\CategoryFormModel;
use App\Repository\CategoryRepository;
use Knp\Component\Pager\PaginatorInterface;

class AdminController extends AbstractController
{
    /**
     * Product overview.
     *
     * @param Request $request
     * @param ProductRepository $repository
     * @param PaginatorInterface $paginator
     *
     * @return Response
     *
     * @Route("/admin/produto/grade", name="admin_product_overview")
     */
    public function productOverview(Request $request, ProductRepository $repository, PaginatorInterface $paginator): Response
    {
        if ($request->isXmlHttpRequest()) {
            $products = $repository->findAll();
            $pagination = $paginator->paginate($products, $request->query->getInt('page', 1), 5);

            return $this->render('admin/_products.html.twig', [
                'pagination' => $pagination,
            ]);
        }

        return $this->render('admin/product_overview.html.twig');
    }

    /**
     * Add a new product.
     *
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param FileUploader $fileUploader
     *
     * @return Response
     *
     * @Route("/admin/produto/novo", name="admin_new_product")
     */
    public function addProduct(Request $request, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    {
        $product = new Product;
        $productModel = new ProductFormModel;

        $form = $this->createForm(ProductType::class, $productModel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $productModel = $form->getData();

            $product->setName($productModel->getName());
            $product->setDescription($productModel->getDescription());
            $product->setLongDescription($productModel->getLongDescription());
            $product->setCategory($productModel->getCategory());
            $product->setPrice($productModel->getPrice());
            $product->setSlug($productModel->getSlug());

            $image = $productModel->getImageFile();
            $filename = $fileUploader->uploadProductImage($image, $product);
            $product->setImage($this->getParameter('app.product_image_directory'), $filename);

            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'product_added'
            );

            return $this->redirectToRoute('admin_product_overview');
        }

        return $this->render('admin/new_product.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * Edit an existing product.
     *
     * @param Request $request
     * @param Product $product
     * @param EntityManagerInterface $entityManager
     * @param FileUploader $fileUploader
     *
     * @return Response
     *
     * @Route("/admin/produto/{slug}/editar", name="admin_edit_product")
     */
    public function editProduct(Request $request, Product $product, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    {
        $productModel = new ProductFormModel;
        $productModel->setId($product->getId());
        $productModel->setName($product->getName());
        $productModel->setPrice($product->getPrice());
        $productModel->setDescription($product->getDescription());
        $productModel->setLongDescription($product->getLongDescription());
        $productModel->setCategory($product->getCategory());

        $form = $this->createForm(ProductType::class, $productModel, [
            'requiredImage' => false,
            'validation_groups' => ['EditProduct'],
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $productModel = $form->getData();

            $product->setName($productModel->getName());
            $product->setPrice($productModel->getPrice());
            $product->setDescription($productModel->getDescription());
            $product->setLongDescription($productModel->getLongDescription());
            $product->setCategory($productModel->getCategory());
            $image = $productModel->getImageFile();

            if ($image) {
                $filename = $fileUploader->uploadProductImage($image, $product);
                $product->setImage($this->getParameter('app.product_image_directory'), $filename);
            }

            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'product_changes_applied'
            );

            return $this->redirectToRoute('admin_product_overview');
        }

        return $this->render('admin/edit_product.html.twig', [
            'form' => $form->createView(),
            'product' => $product,
        ]);
    }

    /**
     * Delete a product.
     *
     * @param Request $request
     * @param Product $product
     * @param EntityManagerInterface $entityManager
     *
     * @return Response
     *
     * @Route("/admin/produto/{slug}/deletar", methods={"POST"}, name="admin_delete_product")
     */
    public function deleteProduct(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        if (!$this->isCsrfTokenValid('delete-product', $request->request->get('token'))) {
            return $this->redirectToRoute('admin_product_overview');
        }

        $product->deleteImage($this->getParameter('app.product_image_directory'));

        $entityManager->remove($product);
        $entityManager->flush();

        $this->addFlash(
            'kabum-light-blue',
            'product_deleted'
        );

        return $this->redirectToRoute('admin_product_overview');
    }

    /**
     * Add a category.
     *
     * @param Request $request
     * @param CategoryRepository $repository
     * @param EntityManagerInterface $entityManager
     *
     * @return Response
     *
     * @Route("/admin/categoria/nova", name="admin_new_category")
     */
    public function addCategory(Request $request, CategoryRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $category = new Category;
        $categoryModel = new CategoryFormModel;

        $form = $this->createForm(CategoryType::class, $categoryModel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $categoryModel = $form->getData();

            $category->setName($categoryModel->getName());
            $category->setSlug($categoryModel->getSlug());

            $entityManager->persist($category);
            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'category_created'
            );

            return $this->redirectToRoute('admin_new_category');
        }

        $categories = $repository->findAll();

        return $this->render('admin/category_list.html.twig', [
            'form' => $form->createView(),
            'categories' => $categories,
        ]);
    }

    /**
     * Delete a category.
     *
     * @param Request $request
     * @param Category $category
     * @param EntityManagerInterface $entityManager
     *
     * @return Response
     *
     * @Route("/admin/categoria/{slug}/deletar", methods={"POST"}, name="admin_delete_category")
     */
    public function deleteCategory(Request $request, Category $category, EntityManagerInterface $entityManager): Response
    {
        if (!$this->isCsrfTokenValid('delete-category', $request->request->get('token'))) {
            return $this->redirectToRoute('admin_new_category');
        }

        $products = $category->getProducts();

        if (count($products)) {
            $this->addFlash(
                'kabum-orange',
                'category_not_empty_cannot_delete'
            );

            return $this->redirectToRoute('admin_new_category');
        }

        $entityManager->remove($category);
        $entityManager->flush();

        $this->addFlash(
            'kabum-light-blue',
            'category_deleted'
        );

        return $this->redirectToRoute('admin_new_category');
    }
}
