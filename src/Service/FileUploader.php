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

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Entity\Product;

class FileUploader
{
    private $productImageDirectory;

    public function __construct($productImageDirectory)
    {
        $this->productImageDirectory = $productImageDirectory;
    }

    public function uploadProductImage(UploadedFile $image, Product $product)
    {
        $extension = $image->guessExtension();

        if (!$extension) {
            // When the extension cannot be guessed
            $extension = 'jpg';
        }

        // Set the filename and store the file
        $filename = $product->getSlug() . '.' . $extension;
        $image->move($this->productImageDirectory, $filename);

        return $filename;
    }
}
