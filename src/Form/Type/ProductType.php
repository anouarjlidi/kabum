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
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use App\Form\Model\ProductFormModel;
use App\Utils\Slugger;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $nameListener = function (FormEvent $event) {
            $productModel = $event->getData();

            if (null !== $productModel->getName()) {
                $slug = Slugger::slugify($productModel->getName());
                $productModel->setSlug($slug);
            }
        };

        $builder
            ->add('name', TextType::class)
            ->add('description', TextareaType::class)
            ->add('price', TextType::class)
            ->add('imageFile', FileType::class, [
                'attr' => [
                    'lang' => $options['currentLocale'],
                    'placeholder' => 'Select the image',
                ],
            ])
            /*
             * In order to transform the name into a slug and make automatic
             * form validation catch its violations, we must use Form Events.
             */
            ->addEventListener(FormEvents::SUBMIT, $nameListener)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ProductFormModel::class,
            'currentLocale' => '',
        ]);
    }
}
