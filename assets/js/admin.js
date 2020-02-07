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

require('../scss/admin.scss');

const $ = require('jquery');
require('jquery-mask-plugin');
import CustomFileInput from './bs-custom-file-input/custom_file_input.js';
const NavigationPanel = require('nav-panel');

$(document).ready(function() {
  var customFileInput = new CustomFileInput();
  customFileInput.startup();

  var navPanel = new NavigationPanel();
  navPanel.setup();

  // Apply money mask
  $('.money-input').mask('000.000.000.000.000,00', {reverse: true});
});
