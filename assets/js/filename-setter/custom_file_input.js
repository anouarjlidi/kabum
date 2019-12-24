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
    this.label = $('.custom-file-label');
    this.files = this.input.prop('files');
  }

  startup() {
    if (!this.findCustomFileInput()) {
      return;
    }

    /*
     * If you select a file and refresh the page, it will continue there, but
     * the label won't show its filename anymore. This sets the filename again.
     */
    if (this.files.length) {
      this.setFilename();
    }

    /*
     * Set the filename whenever a file is selected.
     *
     * Because of the Arrow function, 'this' refers to CustomFileInput within
     * this event handler.
     */
    this.input.change(() => {
      this.setFilename();
    });
  }

  setFilename() {
    let filename = this.files[0].name;
    this.label.text(filename);
  }

  /**
   * Look for a custom file input on the current page.
   *
   * This is useful to prevent this script from running where a custom file input
   * is not found.
   *
   * Returns true if one is found, false otherwise.
   */
  findCustomFileInput() {
    let customFileWrapper = $('.custom-file');

    if (customFileWrapper.length) {
      return true;
    }

    return false;
  }
}
