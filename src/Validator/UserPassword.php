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

/**
 * Verifies if the password given is the correct user password.
 *
 * It also prevents a violation when the password and repeat password fields
 * are not used.
 *
 * @Annotation
 * @Target({"CLASS"})
 */
class UserPassword extends Constraint
{
    /**
     * @var string
     */
    public $message = 'wrong_password';

    /**
     * Just like the "Target" annotation, this defines to what this constraint
     * is allowed to be applied to. Example: PROPERTY_CONSTRAINT or CLASS_CONSTRAINT.
     */
    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
