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
  /*
   * Ajax Paginator
   */

  // Button used to load the next page
  var $seeMoreButton = $('#see-more');

  // Detect if the current page uses the Ajax Paginator
  if ($seeMoreButton.hasClass('ajax-paginate')) {
    var page = 1;

    // The slug is optional. It will be of type 'undefined' when it's not provided
    var slug = $seeMoreButton.data('slug');

    /*
     * These elements are used to inform screen readers about the status
     * of the running request.
     */
    var $requestStatus = $('#request-status');
    var $requestError = $('#request-error');

    // Status messages
    var loading = $requestStatus.data('loading');
    var ready = $requestStatus.data('ready');
    var error = $requestError.data('error');

    // Labels for the page loader button
    var $readyButtonLabel = $('#ready-btn-label');
    var $loadingButtonLabel = $('#loading-btn-label');
    var $errorButtonLabel = $('#error-btn-label');

    $requestStatus.text(loading);

    // Load first page
    $.get(slug, {page: page})
      .done(function(data) {
        $('#loader').addClass('hidden');

        $('#product-grid').append(data);

        /*
         * The article element from the requested data provides important
         * pagination information.
         */
        var $article = $('article');
        var numberOfResults = $article.data('numberOfResults');
        var pageSize = $article.data('pageSize');

        if (numberOfResults > pageSize) {
          // The next page contains results
          $readyButtonLabel.show();
          $seeMoreButton.show();
        } else if (numberOfResults === undefined) {
          // There are no results
          $('#nothing-here').removeClass('hidden');
        } else {
          // All results shown, nothing else to show
          $('#nothing-else').show();
        }

        $requestStatus.text(ready);
      }).fail(function() {
        $('#loader').addClass('hidden');
        $('#error').removeClass('hidden');

        $requestStatus.empty();
        $requestError.text(error);
      });

    page++;

    // Load the next page
    $seeMoreButton.click(function() {
      $requestStatus.text(loading);

      // If the previous request failed, reset button color
      if ($seeMoreButton.hasClass('btn-outline-strawberry')) {
        $seeMoreButton.removeClass('btn-outline-strawberry');
        $seeMoreButton.addClass('btn-outline-kabum-light-blue');
      }

      $loadingButtonLabel.show();
      $readyButtonLabel.hide();
      $errorButtonLabel.hide();

      $.get(slug, {page: page})
        .done(function(data) {
          $('#product-grid').append(data);

          page++;

          var $article = $('article');
          var lastPage = $article.data('lastPage');

          if (page > lastPage) {
            // There are no more pages
            $seeMoreButton.hide();
            $('#nothing-else').show();
          }

          // Focus the first item in the newly loaded page
          $('.focus-me').last().focus();

          $loadingButtonLabel.hide();
          $readyButtonLabel.show();

          $requestStatus.text(ready);
        }).fail(function() {
          $loadingButtonLabel.hide();
          $readyButtonLabel.hide();
          $errorButtonLabel.show();

          // Change the color of the button to help indicate an error has happened
          $seeMoreButton.removeClass('btn-outline-kabum-light-blue');
          $seeMoreButton.addClass('btn-outline-strawberry');

          $requestStatus.empty();
          $requestError.text(error);
        });
    });
  }

  /*
   * Instant Search
   */

  var $instantSearchInput = $('#instant-search-input');

  $instantSearchInput.keyup(function() {
    var query = $instantSearchInput.val();

    // Detect empty query
    if (query === '') {
      $('#instant-search-result').empty();
      $('#instant-search-status').empty();

      $('#instant-search-box').hide();
      $instantSearchInput.attr('aria-expanded', false);

      return;
    }

    $.get('/search/instant', {query: query}, function(data) {
      $('#instant-search-result').html(data);
      $('#instant-search-box').show();

      $instantSearchInput.attr('aria-expanded', true);

      // Set status information
      var resultCount = $('#result-count').data('instantSearchStatus');
      $('#instant-search-status').text(resultCount);
    });
  });
});
