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

namespace App\Service;

use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use App\Entity\Product;

/**
 * Storage layer for shopping cart.
 */
class ShoppingCartStorage
{
    private $session;

    private $serializer;

    public function __construct(SessionInterface $session)
    {
        $this->session = $session;

        $normalizers = [new ObjectNormalizer()];
        $this->serializer = new Serializer($normalizers);
    }

    /**
     * Converts the Doctrine object into a plain PHP array.
     */
    private function normalize(Product $product): array
    {
        return $this->serializer->normalize($product, null, [
            'attributes' => ['name', 'image']
        ]);
    }

    /**
     * Push a product into the shopping cart.
     *
     * If the cart doesn't exist, it will be created.
     *
     * @param Product $product
     */
    public function add(Product $product)
    {
        if ($this->session->has('cart')) {
            $cart = $this->session->get('cart');
            $cart[$product->getId()] = $this->normalize($product);

            $this->session->set('cart', $cart);
        } else {
            $cart = [
                $product->getId() => $this->normalize($product),
            ];

            $this->session->set('cart', $cart);
        }
    }

    /**
     * Retrieve all products from the shopping cart.
     *
     * @return array|null
     */
    public function all(): ?array
    {
        return $this->session->get('cart');
    }
}
