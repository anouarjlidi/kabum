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

use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Attribute\NamespacedAttributeBag;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use App\Entity\Product;

/**
 * Storage layer for the shopping cart.
 */
class ShoppingCartStorage
{
    private $session;

    private $serializer;

    /**
     * @var string The name used as the key to find all cart items
     */
    private $storageKey;

    /**
     * @var string Separates the namespace from the attribute name
     */
    private $namespaceCharacter = '/';

    public function __construct(string $storageKey)
    {
        $this->session = new Session(new NativeSessionStorage(), new NamespacedAttributeBag());

        $this->storageKey = $storageKey;

        $normalizers = [new ObjectNormalizer()];
        $this->serializer = new Serializer($normalizers);
    }

    /**
     * Converts the Doctrine object into a plain PHP array.
     *
     * @param Product $product
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
        $this->session->set(
            $this->storageKey . $this->namespaceCharacter . $product->getId(),
            $this->normalize($product)
        );
    }

    /**
     * Retrieve all products from the shopping cart.
     *
     * @return array|null
     */
    public function all(): ?array
    {
        return $this->session->get($this->storageKey);
    }
}
