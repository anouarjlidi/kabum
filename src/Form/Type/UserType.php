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
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use App\Form\Model\UserFormModel;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, [
                'label' => 'username',
                'help' => 'username_allowed_characters',
                'attr' => [
                    'autofocus' => true,
                ],
            ])
            ->add('password', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'reconfirm_password',
                'required' => $options['requiredPassword'],
                'first_options' => [
                    'label' => 'password',
                ],
                'second_options' => [
                    'label' => 'repeat_password',
                ],
            ])
            ->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
                $user = $event->getData();
                $form = $event->getForm();
                $options = $form->getConfig()->getOptions();

                /*
                 * This ensures the agreeTerms field is only added when you're
                 * creating a new User entity (on registration), and not when
                 * editing it.
                 */
                if (!$user || null === $user->getId()) {
                    $form->add('agreeTerms', CheckboxType::class, [
                        'label' => 'agree_terms',
                        'label_attr' => [
                            'class' => 'checkbox-custom',
                        ],
                    ]);
                } else {
                    $form->add('currentPassword', PasswordType::class, [
                        'label' => 'current_password',
                        'required' => $options['requiredPassword'],
                    ]);
                }
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserFormModel::class,
            'requiredPassword' => true,
            'validation_groups' => ['Default', 'AccountSettings'],
        ]);
    }
}
