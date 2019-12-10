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
use App\Entity\User;
use App\Validator\UniqueUser;

/**
 * A DTO (Data Transfer Object) for the user entity.
 *
 * @UniqueUser
 */
class UserFormModel
{
    /**
     * The ID is needed in the custom validator UniqueUser.
     */
    private $id;

    /**
     * @Assert\NotBlank
     * @Assert\Length(
     *     min = 3,
     *     max = 25,
     * )
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z0-9_]+$/",
     *     message="O nome de usuário só pode ser composto por caracteres alfanuméricos, a única exceção sendo o caractere sublinhado."
     * )
     */
    private $username;

    /**
     * @Assert\NotBlank
     * @Assert\Length(
     *     min = 6,
     *     minMessage = "A senha precisa ter no mínimo 6 caracteres.",
     *     max = 255,
     * )
     */
    private $password;

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

    /**
     * @Assert\IsTrue(message="Você deve estar de acordo com os termos para criar uma conta.")
     */
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
