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
 * Implements the combobox pattern to quickly display search results as you type.
 */
export default class SearchBox {
  constructor() {
    this.input = $('.instant-search-input');
    this.query = '';
  }

  startup() {
    /*
     * Because of the Arrow function, 'this' refers to SearchBox within
     * this event handler.
     */
    this.input.keyup(() => {
      this.inputValue = this.input.val();

      if (this.isInputEmpty()) {
        this.close();

        return;
      }

      this.getSearchResults();
      this.open();
      this.setStatus();
    });
  }

  set inputValue(query) {
    this.query = query;
  }

  /**
   * Test for an empty search query.
   *
   * Returns true if the input is empty, false otherwise.
   */
  isInputEmpty() {
    if (this.query === '') {
      return true;
    }

    return false;
  }

  close() {
    $('.instant-search-result').empty();
    $('.instant-search-status').empty();
    $('.instant-search-box').hide();
    this.input.attr('aria-expanded', false);
  }

  open() {
    $('.instant-search-box').show();
    this.input.attr('aria-expanded', true);
  }

  /**
   * Informs the request status to assistive technologies.
   */
  setStatus() {
    let resultCount = $('.result-count').data('instantSearchStatus');
    $('.instant-search-status').text(resultCount);
  }

  /**
   * Performs an Ajax request and populates the combobox with its result.
   */
  getSearchResults() {
    $.get('/search/instant', {query: this.query}, function(data) {
      $('.instant-search-result').html(data);
    });
  }
}
