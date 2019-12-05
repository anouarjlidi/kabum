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

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * Validates for the uniqueness of the slug.
 *
 * This is primarily meant for Data Transfer Objects, where
 * the native @UniqueEntity cannot be used; or when additional
 * verification is needed.
 *
 * (1) One of the requirements to use this constraint on a DTO is having an 'id'
 * property in it. Checking the 'id' prevents a violation under a specific condition.
 *
 * (2) The entity or DTO to be validated with this constraint must contain
 * the method getEntityClassName() that will return the fully qualified
 * class name of the respective entity (e.g. Product::class). This requirement
 * is more of a workaround and will likely be removed in future redesigns.
 *
 * @Annotation
 * @Target({"CLASS"})
 */
class UniqueSlug extends Constraint
{
    /**
     * @var string
     */
    public $message = 'Slug is not unique.';

    /**
     * @var string The entity property to be associated to the violation
     */
    public $propertyPath;

    /**
     * Just like the "Target" annotation, this defines to what this constraint
     * is allowed to be applied to. Example: PROPERTY_CONSTRAINT or CLASS_CONSTRAINT.
     */
    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
