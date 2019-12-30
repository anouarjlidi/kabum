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
    this.query = null;
    this.target = null;
  }

  startup() {
    // Abort if instant search is not implemented in the current page
    if (!this.findInstantSearch()) {
      return;
    }

    var searchbox = this;

    this.input.each(function() {
      var input = $(this);

      input.on('input', function() {
        searchbox.query = input.val();
        searchbox.target = input.data('target');

        if (searchbox.isInputEmpty()) {
          searchbox.close(input);

          return;
        }

        var request = searchbox.requestData();

        request
          .done(data => {
            var instantSearchResult = input.siblings('.instant-search-box').children('.instant-search-result');
            instantSearchResult.html(data);

            searchbox.open(input);
            searchbox.setStatus(input);

            var suggestions = instantSearchResult.children('.instant-search-suggestion');

            searchbox.setupNavigation(input, suggestions);
          });
      });
    });
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

  /**
   * Look for the instant search component in the current page.
   *
   * Returns true if at least one is found, false otherwise.
   */
  findInstantSearch() {
    var instantSearchWrapper = $('.instant-search');

    if (instantSearchWrapper.length) {
      return true;
    }

    return false;
  }

  close(input) {
    var instantSearchBox = input.siblings('.instant-search-box');

    instantSearchBox.children('.instant-search-result').empty();
    instantSearchBox.hide();
    input.siblings('.instant-search-status').empty();
    input.attr('aria-expanded', false);
    input.removeAttr('aria-activedescendant');
  }

  open(input) {
    // Abort if the combobox is already open
    if (input.attr('aria-expanded') == 'true') {
      return;
    }

    input.siblings('.instant-search-box').show();
    input.attr('aria-expanded', true);
  }

  /**
   * Informs the request status to assistive technologies.
   */
  setStatus(input) {
    var instantSearchStatus = input.siblings('.instant-search-status');
    var instantSearchResult = input.siblings('.instant-search-box').children('.instant-search-result');
    var resultCount = instantSearchResult.children('.result-count').data('instantSearchStatus');

    instantSearchStatus.text(resultCount);
  }

  /**
   * Performs the Ajax request and returns the jqXHR object.
   */
  requestData() {
    var jqxhr = $.get(this.target, {query: this.query});

    return jqxhr;
  }

  setupNavigation(input, suggestions) {
    // Unbind the previous event handler
    input.off('keydown');

    var selected = false;

    input.keydown(() => {
      switch(event.which) {
        case 38: // ARROW UP
          event.preventDefault();

          if (selected === false) {
            selected = suggestions.last();

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            input.attr('aria-activedescendant', selected.attr('id'));
          } else if (selected.is(suggestions.first())) {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');
            input.removeAttr('aria-activedescendant');

            selected = false;
          } else {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');

            selected = selected.prev('.instant-search-suggestion');

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            input.attr('aria-activedescendant', selected.attr('id'));
          }

          break;
        case 40: // ARROW DOWN
          event.preventDefault();

          if (selected === false) {
            selected = suggestions.first();

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            input.attr('aria-activedescendant', selected.attr('id'));
          } else if (selected.is(suggestions.last())) {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');
            input.removeAttr('aria-activedescendant');

            selected = false;
          } else {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');

            selected = selected.next('.instant-search-suggestion');

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            input.attr('aria-activedescendant', selected.attr('id'));
          }

          break;
        case 27: // ESC
          event.preventDefault();

          this.close(input);

          break;
        case 13: // ENTER
          var selectedSuggestion = input.attr('aria-activedescendant');

          if (selectedSuggestion) {
            event.preventDefault();

            var instantSearchResult = input.siblings('.instant-search-box').children('.instant-search-result');
            instantSearchResult.children('#' + selectedSuggestion).get(0).click();
          }

          break;
        case 9: // TAB
          this.close(input);

          break;
      }
    });
  }
}
