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

namespace App\Form\Model;

use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Category;
use App\Validator\UniqueSlug;

/**
 * A DTO (Data Transfer Object) for the category entity.
 *
 * @UniqueSlug(propertyPath="name")
 */
class CategoryFormModel
{
    /**
     * The ID is needed in the custom validator UniqueSlug.
     */
    private $id;

    /**
     * @Assert\NotBlank
     */
    private $name;

    private $slug;

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

    public function getSlug()
    {
        return $this->slug;
    }

    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Returns the fully qualified class name of the Category entity.
     *
     * @see App\Validator\UniqueSlug
     */
    public function getEntityClassName()
    {
        return Category::class;
    }
}
