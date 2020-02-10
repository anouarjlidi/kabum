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

namespace App\Twig;

use Twig\Extension\RuntimeExtensionInterface;
use Parsedown;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class AppRuntime implements RuntimeExtensionInterface
{
    private $converter;

    private $router;

    public function __construct(Parsedown $converter, UrlGeneratorInterface $router)
    {
        $this->converter = $converter;
        $this->router = $router;
    }

    /**
     * Converts Markdown to HTML.
     */
    public function markdownConverter($content)
    {
        $this->converter->setSafeMode(true);

        $html = $this->converter->text($content);

        return $html;
    }

    /**
     * Formats a number into money.
     *
     * It will also render the currency symbol, but it's currently
     * limited to BRL.
     */
    public function formatPrice($number, $decimals = 2, $decPoint = ',', $thousandsSep = '.')
    {
        // Remove the 2 trailing zeroes
        $number = $number / 100;

        $price = number_format($number, $decimals, $decPoint, $thousandsSep);
        $price = 'R$ ' . $price;

        return $price;
    }

    /**
     * Slice a route path.
     *
     * It selects a certain number of slices from the specified route path,
     * counting from left to right. The result is a shorter path that is most
     * commonly used to match multiple similar route paths.
     *
     * For example, if $numberOfSlices is set to 3, the path 'route/path/towards/resource'
     * will become 'route/path/towards'.
     */
    public function sliceRoutePath(string $routeName, int $numberOfSlices)
    {
        $routePath = $this->router->generate($routeName);

        $pathSlices = explode('/', trim($routePath, '/'));
        $pathSlices = array_slice($pathSlices, 0, abs($numberOfSlices));
        $slicedPath = implode('/', $pathSlices);

        return $slicedPath;
    }
}
