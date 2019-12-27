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

/**
 * Filename Setter.
 *
 * Custom Bootstrap file input widgets don't display the currently selected
 * filename in its label. This script takes care of that.
 *
 * Currently it only supports single-file uploads.
 */
export default class CustomFileInput {
  constructor() {
    this.input = $('.custom-file-input');
  }

  startup() {
    // Abort if no custom file input was found
    if (!this.findCustomFileInput()) {
      return;
    }

    var customFileInput = this;

    /*
     * If you select a file and refresh the page, it will continue there, but
     * the label won't show its filename anymore. This sets the filename again.
     */
    this.input.each(function() {
      var files = $(this).prop('files');
      var label = $(this).siblings('.custom-file-label');

      if (files.length) {
        customFileInput.setFilename(files, label);
      }
    });

    /*
     * Set the filename whenever a file is selected.
     */
    this.input.each(function() {
      $(this).change(function() {
        var files = $(this).prop('files');
        var label = $(this).siblings('.custom-file-label');

        customFileInput.setFilename(files, label);
      });
    });
  }

  /**
   * Write a filename to a label.
   *
   * The 'files' parameter refers to the 'files' property of the input element.
   * The 'label' parameter refers to where the filename will be displayed.
   */
  setFilename(files, label) {
    let filename = files[0].name;
    label.text(filename);
  }

  /**
   * Look for custom file input components on the current page.
   *
   * Returns true if at least one is found, false otherwise.
   */
  findCustomFileInput() {
    let customFileWrapper = $('.custom-file');

    if (customFileWrapper.length) {
      return true;
    }

    return false;
  }
}
