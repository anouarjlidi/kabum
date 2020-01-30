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

class AppRuntime implements RuntimeExtensionInterface
{
    public $converter;

    public function __construct(Parsedown $converter)
    {
        $this->converter = $converter;
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
}
