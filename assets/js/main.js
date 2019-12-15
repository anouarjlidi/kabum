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

require('../scss/main.scss');

const $ = require('jquery');

$(document).ready(function() {
  var page = 1;
  var slug = $('#see-more').data('slug');

  // Load first page
  $.get(slug, {page: page}, function(data) {
    $('#product-grid').append(data);

    var numberOfResults = $('article').data('numberOfResults');
    var pageSize = $('article').data('pageSize');

    if (numberOfResults > pageSize) {
      // The next page contains results
      $('#see-more').show();
    } else if (numberOfResults == 0) {
      // There are no results
      //$('#nothing-here').show();
    } else {
      // All available results were shown
      //$('#nothing-else').show();
    }
  });

  page++;

  // Load the next page
  $('#see-more').click(function() {
    $.get(slug, {page: page}, function(data) {
      $('#product-grid').append(data);

      page++;

      var lastPage = $('article').data('lastPage');

      if (page > lastPage) {
        // There are no more pages
        $('#see-more').hide();
        //$('#nothing-else').show();
      }

      // This will focus the first item of the last requested page
      $('.focus-me').last().focus();
    });
  });
});
