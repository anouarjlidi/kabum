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

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use App\Form\Model\UserFormModel;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($options) {
                $user = $event->getData();
                $form = $event->getForm();

                /*
                 * We make some changes to the form depending on whether
                 * the user is being created or edited.
                 */
                if (!$user || null === $user->getId()) {
                    // Creating a new user
                    $form
                        ->add('username', null, [
                            'label' => 'username',
                            'help' => 'username_allowed_characters',
                            'attr' => [
                                'autofocus' => 'autofocus',
                                'minlength' => 3,
                            ],
                        ])
                        ->add('agreeTerms', null, [
                            'label' => 'agree_terms',
                            'label_attr' => [
                                'class' => 'checkbox-custom',
                            ],
                        ])
                        ->add('password', RepeatedType::class, [
                            'type' => PasswordType::class,
                            'invalid_message' => 'reconfirm_password',
                            'required' => false,
                            'first_options' => [
                                'label' => 'password',
                                'attr' => [
                                    'maxlength' => 4096,
                                    'class' => 'validator-password-first',
                                ],
                            ],
                            'second_options' => [
                                'label' => 'repeat_password',
                                'attr' => [
                                    'maxlength' => 4096,
                                    'class' => 'validator-password-second',
                                ],
                            ],
                        ])
                    ;
                } else {
                    // Editing an existing user
                    $form
                        ->add('username', null, [
                            'label' => 'username',
                            'help' => 'username_allowed_characters',
                            'attr' => [
                                'minlength' => 3,
                            ],
                        ])
                        ->add('currentPassword', PasswordType::class, [
                            'label' => 'current_password',
                            'help' => 'current_password_needed',
                            'required' => false,
                            'attr' => [
                                'maxlength' => 4096,
                            ],
                        ])
                        ->add('password', RepeatedType::class, [
                            'type' => PasswordType::class,
                            'invalid_message' => 'reconfirm_password',
                            'required' => false,
                            'first_options' => [
                                'label' => 'new_password',
                                'attr' => [
                                    'maxlength' => 4096,
                                    'class' => 'validator-password-first',
                                ],
                            ],
                            'second_options' => [
                                'label' => 'repeat_password',
                                'attr' => [
                                    'maxlength' => 4096,
                                    'class' => 'validator-password-second',
                                ],
                            ],
                        ])
                    ;
                }
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserFormModel::class,
            'validation_groups' => ['Default', 'AccountSettings'],
        ]);
    }
}
