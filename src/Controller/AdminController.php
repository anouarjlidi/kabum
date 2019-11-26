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

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin_new_product")
     */
    public function addProduct(EntityManagerInterface $entityManager): Response
    {
        $product = new Product();
        $product->setName('SSD Kingston A400, 480GB, SATA, Leitura 500MB/s, Gravação 450MB/s - SA400S37/480G');
        $product->setPrice(28290);
        $product->setDescription('Reforçado com uma controladora de última geração para velocidades de leitura e gravação de até 500MB/s e 450MB/s, este SSD é 10x mais rápido do que um disco rígido tradicional para melhor desempenho, resposta ultra-rápida em multitarefas e um computador mais rápido de modo geral.');

        $entityManager->persist($product);

        $entityManager->flush();

        return $this->render('admin/new_product.html.twig', [
            'product' => $product,
        ]);
    }
}
