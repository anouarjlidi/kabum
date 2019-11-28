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

namespace App\Utils;

/**
 * Formats a 'slug': a string used in the URL
 * to point to a resource on the domain.
 */
class Slugger
{
    /**
     * @param string $string The string to be 'slugified'
     *
     * @return string
     */
    public static function slugify(string $string): string
    {
        $slug = preg_replace('/[^a-z0-9-]+/', '-', mb_strtolower($string, 'UTF-8'));

        return trim($slug, '-');
    }
}
