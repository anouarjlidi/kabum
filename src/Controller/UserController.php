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

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Security\LoginFormAuthenticator;
use App\Entity\User;
use App\Form\Model\UserFormModel;
use App\Form\Type\UserType;

class UserController extends AbstractController
{
    /**
     * @Route("/cadastro", name="user_register")
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, LoginFormAuthenticator $authenticator, GuardAuthenticatorHandler $guardHandler, EntityManagerInterface $entityManager): Response
    {
        $user = new User;
        $userModel = new UserFormModel;

        $form = $this->createForm(UserType::class, $userModel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userModel = $form->getData();

            $user->setUsername($userModel->getUsername());
            $user->setPassword($passwordEncoder->encodePassword($user, $userModel->getPassword()));

            $entityManager->persist($user);
            $entityManager->flush();

            return $guardHandler->authenticateUserAndHandleSuccess($user, $request, $authenticator, 'main');
        }

        return $this->render('user/registration.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/usuario", name="user_page")
     *
     * @IsGranted("ROLE_USER")
     */
    public function userPage()
    {
        return $this->render('user/user_page.html.twig');
    }

    /**
     * @Route("/usuario/conta", name="user_account")
     *
     * @IsGranted("ROLE_USER")
     */
    public function accountSettings(Request $request, UserPasswordEncoderInterface $passwordEncoder, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $userModel = new UserFormModel;

        $userModel->setId($user->getId());
        $userModel->setUsername($user->getUsername());

        $form = $this->createForm(UserType::class, $userModel, [
            'validation_groups' => ['AccountSettings'],
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userModel = $form->getData();

            $user->setUsername($userModel->getUsername());
            $password = $userModel->getPassword();

            if ($password) {
                $user->setPassword($passwordEncoder->encodePassword($user, $password));
            }

            $entityManager->flush();

            $this->addFlash(
                'kabum-light-blue',
                'changes_applied'
            );

            return $this->redirectToRoute('user_account');
        }

        return $this->render('user/account_settings.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
