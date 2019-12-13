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

namespace App\Form\Model;

use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Product;
use App\Validator\UniqueSlug;

/**
 * A DTO (Data Transfer Object) for the product entity.
 *
 * @UniqueSlug(propertyPath="name", groups={"EditProduct"})
 */
class ProductFormModel
{
    /**
     * The ID is needed in the custom validator UniqueSlug.
     */
    private $id;

    /**
     * @Assert\NotBlank(groups={"EditProduct"})
     */
    private $name;

    /**
     * @Assert\NotBlank(groups={"EditProduct"})
     */
    private $description;

    /**
     * @Assert\NotBlank(groups={"EditProduct"})
     */
    private $longDescription;

    /**
     * @Assert\NotBlank(groups={"EditProduct"})
     */
    private $price;

    private $slug;

    /**
     * @Assert\NotBlank
     * @Assert\Image(groups={"EditProduct"})
     */
    private $imageFile;

    /**
     * @Assert\NotBlank(groups={"EditProduct"})
     */
    private $category;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    public function getLongDescription()
    {
        return $this->longDescription;
    }

    public function setLongDescription($longDescription)
    {
        $this->longDescription = $longDescription;

        return $this;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    public function getSlug()
    {
        return $this->slug;
    }

    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    public function getImageFile()
    {
        return $this->imageFile;
    }

    public function setImageFile($imageFile)
    {
        $this->imageFile = $imageFile;

        return $this;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function setCategory($category)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Returns the fully qualified class name of the Product entity.
     *
     * @see App\Validator\UniqueSlug
     */
    public function getEntityClassName()
    {
        return Product::class;
    }
}
