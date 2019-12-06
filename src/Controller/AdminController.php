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
use App\Entity\Category;
use App\Form\Type\CategoryType;
use App\Form\Model\CategoryFormModel;
use App\Repository\CategoryRepository;

class AdminController extends AbstractController
{
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
            $product->setImage($filename);

            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'Produto adicionado.'
            );

            return $this->redirectToRoute('product_page', ['slug' => $product->getSlug()]);
        }

        return $this->render('admin/new_product.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * Edit an existing product.
     *
     * @param Product $product
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param FileUploader $fileUploader
     *
     * @return Response
     *
     * @Route("/admin/produto/{slug}/editar", name="admin_edit_product")
     */
    public function editProduct(Product $product, Request $request, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    {
        $productModel = new ProductFormModel;
        $productModel->setId($product->getId());
        $productModel->setName($product->getName());
        $productModel->setPrice($product->getPrice());
        $productModel->setDescription($product->getDescription());
        $productModel->setLongDescription($product->getLongDescription());
        $productModel->setCategory($product->getCategory());

        $form = $this->createForm(ProductType::class, $productModel, [
            'required' => false,
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
                $product->setImage($filename);
            }

            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'As alterações ao produto foram aplicadas.'
            );

            return $this->redirectToRoute('product_page', ['slug' => $product->getSlug()]);
        }

        return $this->render('admin/edit_product.html.twig', [
            'form' => $form->createView(),
            'product' => $product,
        ]);
    }

    /**
     * Category management.
     *
     * @param CategoryRepository $repository
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     *
     * @return Response
     *
     * @Route("/admin/categoria/gerenciar", name="admin_category_management")
     */
    public function categoryList(CategoryRepository $repository, Request $request, EntityManagerInterface $entityManager): Response
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
                'Categoria criada.'
            );

            return $this->redirectToRoute('admin_category_management');
        }

        $categories = $repository->findAll();

        return $this->render('admin/category_list.html.twig', [
            'form' => $form->createView(),
            'categories' => $categories,
        ]);
    }
}
