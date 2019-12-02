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

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Entity\Product;

class FileUploader
{
    public function uploadProductImage(UploadedFile $image, Product $product)
    {
        $extension = $image->guessExtension();
        $productId = $product->getId();
        $randomInt = random_int(1, 100000);
        $imageDirectory = $product::IMAGE_DIR;

        if (!$extension) {
            // Extension cannot be guessed
            $extension = 'jpg';
        }

        $filename = $productId . $randomInt . '.' . $extension;
        $image->move($imageDirectory, $filename);

        return $filename;
    }
}
