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
use App\Service\FileUploader;
use App\Entity\Product;
use App\Form\Type\ProductType;
use App\Form\Model\ProductFormModel;

class AdminController extends AbstractController
{
    /**
     * Add a new product.
     *
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     *
     * @return Response
     *
     * @Route("/admin/new", name="admin_new_product")
     */
    public function addProduct(Request $request, EntityManagerInterface $entityManager, FileUploader $fileUploader): Response
    {
        $product = new Product;
        $productModel = new ProductFormModel;

        $form = $this->createForm(ProductType::class, $productModel, [
            'currentLocale' => $request->getLocale(),
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $productModel = $form->getData();

            $product->setName($productModel->getName());
            $product->setDescription($productModel->getDescription());
            $product->setPrice($productModel->getPrice());
            $product->setSlug($productModel->getSlug());

            $image = $productModel->getImageFile();
            $filename = $fileUploader->uploadProductImage($image, $product);
            $product->setImage($filename);

            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'Product added!'
            );

            return $this->redirectToRoute('main_page');
        }

        return $this->render('admin/new_product.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
