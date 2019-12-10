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
use App\Repository\UserRepository;

/**
 * Validates for the uniqueness of the user.
 */
class UniqueUserValidator extends ConstraintValidator
{
    private $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
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
        if (null === $object->getUsername() || '' === $object->getUsername()) {
            return;
        }

        // Find a user with the same username
        $userWithSameUsername = $this->repository->findOneBy([
            'username' => $object->getUsername()
        ]);

        /*
         * Will not add a violation if the chosen username is unique.
         */
        if (!$userWithSameUsername) {
            return;
        }

        /*
         * If the user found with an identical username is the exact same user
         * as the one currently being validated, don't trigger a violation.
         * This is useful when changing the username after registration.
         */
        if ($userWithSameUsername->getId() === $object->getId()) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->atPath('username')
            ->addViolation()
        ;
    }
}
