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

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use App\Entity\User;

/**
 * Validates the user password.
 */
class UserPasswordValidator extends ConstraintValidator
{
    private $passwordEncoder;
    private $security;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder, Security $security)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->security = $security;
    }

    /**
     * The constraint validator method.
     *
     * @param $model The entity or DTO that represents the user on a form
     * @param Constraint $constraint
     */
    public function validate($model, Constraint $constraint)
    {
        /*
         * Don't trigger a violation when the password fields are empty,
         * or when the user hasn't been persisted to the database yet.
         */
        if (!$model->getPassword() || !$model->getId()) {
            return;
        }

        $user = $this->security->getUser();

        /*
         * If the current password is not empty and corresponds to the current
         * user password, don't trigger a violation.
         */
        if ($model->getCurrentPassword() && $this->passwordEncoder->isPasswordValid($user, $model->getCurrentPassword())) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->atPath('currentPassword')
            ->addViolation()
        ;
    }
}
