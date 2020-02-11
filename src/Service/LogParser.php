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

use Symfony\Component\Finder\Finder;

/**
 * Retrieves the content of log files.
 */
class LogParser
{
    private $logsDirectory;

    private $administrationLogFile;

    public function __construct(string $logsDirectory, string $administrationLogFile)
    {
        $this->logsDirectory = $logsDirectory;
        $this->administrationLogFile = $administrationLogFile;
    }

    public function getAdministrationLogs()
    {
        $finder = new Finder();
        $finder->files()->in($this->logsDirectory)->name($this->administrationLogFile);

        foreach ($finder as $file) {
            return $file->getContents();
        }
    }
}
