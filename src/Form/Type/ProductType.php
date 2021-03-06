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
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Contracts\Translation\TranslatorInterface;
use App\Form\Model\ProductFormModel;
use App\Service\Slugger;
use App\Entity\Category;

class ProductType extends AbstractType
{
    private $translator;
    private $slugger;

    public function __construct(TranslatorInterface $translator, Slugger $slugger)
    {
        $this->translator = $translator;
        $this->slugger = $slugger;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', null, [
                'label' => 'name',
            ])
            ->add('description', TextareaType::class, [
                'label' => 'short_description',
                'attr' => [
                    'rows' => 3,
                ],
            ])
            ->add('longDescription', TextareaType::class, [
                'label' => 'long_description',
                'help' => 'use_markdown_here',
                'attr' => [
                    'rows' => 7,
                ],
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'label' => 'category',
                'choice_label' => 'name',
                'placeholder' => 'select_category',
                'attr' => [
                    'class' => 'custom-select',
                ],
            ])
            ->add('price', null, [
                'label' => 'price',
                'attr' => [
                    'class' => 'money-input',
                    /*
                     * This attribute ensures that the virtual numeric keyboard
                     * is used instead of the normal multi-character keyboard
                     * (currently it doesn't work on every modern browser).
                     */
                    'inputmode' => 'numeric',
                ],
            ])
            ->add('imageFile', null, [
                'label' => 'image',
                'required' => $options['requiredImage'],
                'attr' => [
                    'placeholder' => 'select_image',
                ],
                'label_attr' => [
                    'class' => 'text-truncate',
                    'data-browse' => $this->translator->trans('select'),
                ],
            ])
            /*
             * In order to transform the name into a slug and make automatic
             * form validation catch its violations, we must use Form Events.
             */
            ->addEventListener(FormEvents::SUBMIT, function (FormEvent $event) {
                $productModel = $event->getData();

                // Set the slug
                if (null !== $productModel->getName()) {
                    $slug = $this->slugger->slugify($productModel->getName());
                    $productModel->setSlug($slug);
                }
            })
            ->addEventListener(FormEvents::POST_SUBMIT, function (FormEvent $event) {
                $productModel = $event->getData();

                /*
                 * Prepare the price value for storage.
                 *
                 * Remove dots and commas, then store it as an integer.
                 */
                if (null !== $productModel->getPrice()) {
                    $price = $productModel->getPrice();

                    $price = (string) $price;
                    $price = str_replace(array('.', ','), '', $price);
                    $price = (int) $price;

                    $productModel->setPrice($price);
                }
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ProductFormModel::class,
            'requiredImage' => true,
            'validation_groups' => ['Default', 'EditProduct'],
        ]);
    }
}
