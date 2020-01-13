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

namespace App\Service;

/**
 * Formats a 'slug': a string used in the URL to point to a resource
 * on the domain.
 *
 * It supports character translation, which is useful to replace accented characters
 * such as "é", "ã" or "ç" with "e", "a" and "c", respectively.
 *
 * Because this application is used in Brazilian Portuguese, this Slugger
 * is configured to support the most common accented letters for this language.
 */
class Slugger
{
    /**
     * @param string $string The string to be 'slugified'
     *
     * @return string
     */
    public function slugify(string $string): string
    {
        // Convert the string to lowercase
        $slug = strtolower($string);

        // Perform character translation
        $translation = array(
            'ã' => 'a', 'â' => 'a', 'á' => 'a', 'à' => 'a', 'í' => 'i',
            'é' => 'e', 'ê' => 'e', '&' => 'e', 'ç' => 'c', 'ô' => 'o',
            'õ' => 'o', 'ó' => 'o', 'ú' => 'u',
        );
        $slug = strtr($slug, $translation);

        // Eliminate forbidden characters, replacing them with an hyphen (-)
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);

        // Eliminate any hyphens (-) at the start and end of the string
        return trim($slug, '-');
    }
}
