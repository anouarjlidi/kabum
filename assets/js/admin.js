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

const $ = require('jquery');
require('jquery-mask-plugin');

$(document).ready(function() {
  /*
   * Display the file name when one is present in the image field.
   */
  var fileInputCount = $("#product_imageFile").prop("files").length;

  // If a file is already selected when the page loads, display its name
  if (fileInputCount) {
    var fileInputName = $("#product_imageFile").prop("files")[0].name;
    $("#product_imageFile").siblings(".custom-file-label").html(fileInputName);
  }

  // Change the displayed file name when the file changes
  $("#product_imageFile").change(function() {
    var selectedFileName = $(this).prop("files")[0].name;
    $(this).siblings(".custom-file-label").html(selectedFileName);
  });

  /*
   * Apply money mask.
   */
  $('#product_price').mask('000.000.000.000.000,00', {reverse: true});
});
