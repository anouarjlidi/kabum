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
use Symfony\Component\Validator\ConstraintValidator;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Validates for the uniqueness of the slug.
 */
class UniqueSlugValidator extends ConstraintValidator
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * The constraint validator method.
     *
     * @param $object The entity to be validated
     * @param Constraint $constraint
     */
    public function validate($object, Constraint $constraint)
    {
        /*
         * Ignore blank and null values to let other constraints
         * do their jobs.
         */
        if (null === $object->getSlug() || '' === $object->getSlug()) {
            return;
        }

        // Retrieve the Doctrine repository of the respective entity
        $repository = $this->entityManager->getRepository($object->getEntityClassName());

        // Find an entity instance with the same slug
        $entityWithSameSlug = $repository->findOneBy([
            'slug' => $object->getSlug()
        ]);

        /*
         * Will not add a violation if the slug being validated is unique.
         */
        if (!$entityWithSameSlug) {
            return;
        }

        /*
         * If the entity found with an identical slug is the exact same entity
         * as the one currently being validated, don't trigger a violation.
         * This allows edits to an entity without having to change the value
         * of the unique field.
         */
        if ($entityWithSameSlug->getId() === $object->getId()) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->setParameter('{{ value }}', $object->getSlug())
            ->atPath($constraint->propertyPath)
            ->addViolation();
    }
}
