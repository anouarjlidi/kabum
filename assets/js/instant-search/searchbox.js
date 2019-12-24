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

export default function SearchBox() {
  this.input = $('.instant-search-input');
  this.query = '';
  this.startup = function() {
    this.input.keyup(() => {
      this.getQuery();

      if (this.isQueryEmpty()) {
        this.close();

        return;
      }

      this.execute();
      this.open();
      this.setStatus();
    });
  };
  this.getQuery = function() {
    this.query = this.input.val();
  };
  this.isQueryEmpty = function() {
    if (this.query === '') {
      return true;
    }

    return false;
  };
  this.close = function() {
    $('.instant-search-result').empty();
    $('.instant-search-status').empty();
    $('.instant-search-box').hide();
    this.input.attr('aria-expanded', false);
  };
  this.open = function() {
    $('.instant-search-box').show();
    this.input.attr('aria-expanded', true);
  };
  this.setStatus = function() {
    var resultCount = $('.result-count').data('instantSearchStatus');
    $('.instant-search-status').text(resultCount);
  };
  this.execute = function() {
    $.get('/search/instant', {query: this.query}, function(data) {
      $('.instant-search-result').html(data);
    });
  };
};
