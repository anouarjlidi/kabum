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
use App\Validator\UniqueUser;
use App\Entity\User;

/**
 * A DTO (Data Transfer Object) for the user entity.
 *
 * @UniqueUser(groups={"AccountSettings"})
 */
class UserFormModel
{
    /**
     * The ID is needed in the custom validator UniqueUser.
     */
    private $id;

    /**
     * @Assert\NotBlank(groups={"AccountSettings"})
     * @Assert\Length(min=3, max=25, groups={"AccountSettings"})
     * @Assert\Regex(pattern="/^[a-zA-Z0-9_]+$/", message="username_pattern", groups={"AccountSettings"})
     */
    private $username;

    /**
     * @Assert\NotBlank
     * @Assert\Length(max=255, groups={"AccountSettings"})
     */
    private $password;

    /**
     * @Assert\IsTrue(message="must_agree_terms")
     */
    private $agreeTerms;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    public function isAgreeTerms()
    {
        return $this->agreeTerms;
    }

    public function setAgreeTerms($agreeTerms)
    {
        $this->agreeTerms = $agreeTerms;

        return $this;
    }

    /**
     * Returns the fully qualified class name of the User entity.
     *
     * @see App\Validator\UniqueUser
     */
    public function getEntityClassName()
    {
        return User::class;
    }
}
