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
import SearchBox from './instant-search/searchbox.js';

$(document).ready(function() {
  var searchbox = new SearchBox();
  searchbox.startup();

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

          // Prevent any further modifications to the aria-posinset attribute on the current item
          $(this).removeClass('new-feed-item');
        });

        // Decrease one to compensate for the last article which is the "Load More" button
        itemCount--;

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
          $('#see-more').attr('aria-labelledby', 'ready-btn-label');
          $('#see-more').show();

          // Set 'aria-setsize' for each item
          $productGrid.children().each(function() {
            $(this).attr('aria-setsize', itemCount);
          });
        } else if (numberOfResults === undefined) {
          // There are no results
          $productGrid.hide();
          $('#nothing-here').removeClass('hidden');
        } else {
          // All results shown, nothing else to show
          $('#nothing-else').show();

          // Under this condition, the button from the latest request will be hidden, so account for it
          itemCount--;

          // Set 'aria-setsize' for each item
          $productGrid.children().each(function() {
            $(this).attr('aria-setsize', itemCount);
          });
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
        $('#see-more').attr('aria-labelledby', 'loading-btn-label');
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

              // Prevent any further modifications to the aria-posinset attribute on the current item
              $(this).removeClass('new-feed-item');
            });

            // Decrease one to compensate for the last article which is the "Load More" button
            itemCount--;

            var $article = $('.ajax-paginate > article').first();
            var lastPage = $article.data('lastPage');

            // The newly added element that holds a "Load More" button
            var $seeMore = $('#see-more');

            if (page > lastPage) {
              // There are no more pages
              $('#nothing-else').show();

              // Under this condition, the button from the latest request will be hidden, so account for it
              itemCount--;

              // Set 'aria-setsize' for each item
              $productGrid.children().each(function() {
                $(this).attr('aria-setsize', itemCount);
              });
            } else {
              // The next page contains results
              $seeMore.show();
              $('#ready-btn-label').show();
              $('#see-more').attr('aria-labelledby', 'ready-btn-label');

              // Set 'aria-setsize' for each item
              $productGrid.children().each(function() {
                $(this).attr('aria-setsize', itemCount);
              });
            }

            // Focus the first item in the newly loaded page
            $('.focus-me').last().focus();

            $requestStatus.text(ready);
            $productGrid.attr('aria-busy', false);
          }).fail(function() {
            $loadingButtonLabel.hide();
            $readyButtonLabel.hide();
            $errorButtonLabel.show();
            $('#see-more').attr('aria-labelledby', 'error-btn-label');

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

    $productGrid.keydown(function(event) {
      var $focusedItem = $(event.target);

      // If the item in focus is not an <article>, find the closest <article>
      if ($focusedItem.is(':not(article)')) {
        $focusedItem = $focusedItem.closest('article');
      }

      var itemIndex = $focusedItem.attr('aria-posinset');

      switch(event.which) {
        case 33: // PAGE_UP
          event.preventDefault();

          if (itemIndex > 1) {
            itemIndex--;
            $('[aria-posinset="' + itemIndex + '"]').focus();
          }

          break;
        case 34: // PAGE_DOWN
          event.preventDefault();

          if (itemIndex < itemCount) {
            itemIndex++;
            $('[aria-posinset="' + itemIndex + '"]').focus();
          }

          break;
        case 35: // CTRL + END
          if (event.ctrlKey) {
            event.preventDefault();

            if (itemIndex !== itemCount) {
              $('[aria-posinset="' + itemCount + '"]').focus();
            }
          }

          break;
        case 36: // CTRL + HOME
          if (event.ctrlKey) {
            event.preventDefault();

            if (itemIndex !== 1) {
              $('[aria-posinset="1"]').focus();
            }
          }

          break;
      }
    });
  }
});
