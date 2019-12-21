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

  var $productGrid = $('#product-grid');

  // Detect if the current page uses the Ajax Paginator
  if ($productGrid.hasClass('ajax-paginate')) {
    var page = 1;
    var itemCount = 1;

    // The slug is optional. It will be of type 'undefined' when it's not provided
    var slug = $productGrid.data('slug');

    // Informs the screen reader about the status of the request
    var $requestStatus = $('#request-status');

    // Status messages
    var loading = $requestStatus.data('loading');
    var ready = $requestStatus.data('ready');
    var error = $requestStatus.data('error');

    // Informs the screen reader of an error in the request
    var $errorAlert = $('<span>', {
      id: 'request-error',
      class: 'sr-only',
      role: 'alert',
      text: error
    });

    $requestStatus.text(loading);
    $productGrid.attr('aria-busy', true);

    // Load first page
    $.get(slug, {page: page})
      .done(function(data) {
        $('#loader').addClass('hidden');

        $productGrid.append(data);

        // Set 'aria-posinset' for each item
        $('.new-feed-item').each(function() {
          $(this).attr('aria-posinset', itemCount);
          itemCount++;

          // Remove the selector class so it is never processed again
          $(this).removeClass('new-feed-item');
        });

        /*
         * The article element from the requested data provides important
         * pagination information.
         */
        var $article = $('.ajax-paginate > article').first();
        var numberOfResults = $article.data('numberOfResults');
        var pageSize = $article.data('pageSize');

        if (numberOfResults > pageSize) {
          // The next page contains results
          $('#ready-btn-label').show();
          $('#see-more').show();
        } else if (numberOfResults === undefined) {
          // There are no results
          $('#nothing-here').removeClass('hidden');
        } else {
          // All results shown, nothing else to show
          $('#nothing-else').show();
        }

        $requestStatus.text(ready);
        $productGrid.attr('aria-busy', false);

        getNextPage();
      }).fail(function() {
        $('#loader').addClass('hidden');
        $('#error').removeClass('hidden');

        $requestStatus.empty();
        $errorAlert.insertAfter($requestStatus);
        $productGrid.attr('aria-busy', false);
      });

    // Load the next page
    function getNextPage() {
      page++;

      /*
       * Attach the click event handler to all elements with
       * class .see-more-button within the product grid.
       */
      $productGrid.on('click', '.see-more-button', function() {
        $requestStatus.text(loading);
        $productGrid.attr('aria-busy', true);

        var $seeMoreButton = $('.see-more-button');

        $seeMoreButton.prop('disabled', true);

        var $loadingButtonLabel = $('#loading-btn-label');
        var $readyButtonLabel = $('#ready-btn-label');
        var $errorButtonLabel = $('#error-btn-label');

        $loadingButtonLabel.show();
        $readyButtonLabel.hide();
        $errorButtonLabel.hide();

        // If the previous request failed, reset button color and remove alert
        if ($errorAlert) {
          $seeMoreButton.removeClass('text-strawberry');
          $seeMoreButton.addClass('text-kabum-light-blue');
          $errorAlert.remove();
        }

        $.get(slug, {page: page})
          .done(function(data) {
            // Delete the obsolete "Load More" button container
            $('#see-more').remove();

            /*
             * Append a new set of products to the product grid, including
             * a new "Load More" button.
             */
            $productGrid.append(data);

            page++;

            // Set 'aria-posinset' for each new item
            $('.new-feed-item').each(function() {
              $(this).attr('aria-posinset', itemCount);
              itemCount++;

              // Remove the selector class so it is never processed again
              $(this).removeClass('new-feed-item');
            });

            var $article = $('.ajax-paginate > article').first();
            var lastPage = $article.data('lastPage');

            // The newly added element that holds a "Load More" button
            var $seeMore = $('#see-more');

            if (page > lastPage) {
              // There are no more pages
              $('#nothing-else').show();
            } else {
              // The next page contains results
              $seeMore.show();
              $('#ready-btn-label').show();
            }

            // Focus the first item in the newly loaded page
            $('.focus-me').last().focus();

            $requestStatus.text(ready);
            $productGrid.attr('aria-busy', false);
          }).fail(function() {
            $loadingButtonLabel.hide();
            $readyButtonLabel.hide();
            $errorButtonLabel.show();

            // Change the color of the button to help indicate an error has happened
            $seeMoreButton.removeClass('text-kabum-light-blue');
            $seeMoreButton.addClass('text-strawberry');

            $requestStatus.empty();
            $errorAlert.insertAfter($requestStatus);
            $productGrid.attr('aria-busy', false);
            $seeMoreButton.prop('disabled', false);
          });
      });
    }
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
