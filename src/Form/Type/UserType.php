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

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use App\Form\Model\UserFormModel;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, [
                'label' => 'username',
                'required' => true,
                'attr' => [
                    'autofocus' => true,
                    'aria-required' => 'true',
                ],
            ])
            ->add('password', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'reconfirm_password',
                'required' => true,
                'first_options' => [
                    'label' => 'password',
                    'attr' => [
                        'aria-required' => 'true',
                    ],
                ],
                'second_options' => [
                    'label' => 'repeat_password',
                    'attr' => [
                        'aria-required' => 'true',
                    ],
                ],
            ])
            ->add('agreeTerms', CheckboxType::class, [
                'required' => true,
                'label' => 'agree_terms',
                'label_attr' => [
                    'class' => 'checkbox-custom',
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserFormModel::class,
        ]);
    }
}
