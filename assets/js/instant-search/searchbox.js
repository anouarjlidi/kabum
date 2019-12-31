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
    this.instances = $('.instant-search-input');
    this.input;
    this.query;
    this.target;
    this.box;
    this.result;
  }

  startup() {
    // Abort if instant search is not implemented in the current page
    if (!this.findInstantSearch()) {
      return;
    }

    var searchbox = this;

    this.instances.each(function() {
      searchbox.input = $(this);

      searchbox.input.on('input', function() {
        searchbox.query = searchbox.input.val();
        searchbox.target = searchbox.input.data('target');
        searchbox.box = searchbox.input.siblings('.instant-search-box');
        searchbox.result = searchbox.box.children('.instant-search-result');

        if (searchbox.isInputEmpty()) {
          searchbox.close();

          return;
        }

        var request = searchbox.requestData();

        request
          .done(data => {
            searchbox.input.removeAttr('aria-activedescendant');

            searchbox.result.html(data);
            searchbox.open();
            searchbox.setStatus();

            var suggestions = searchbox.result.children('.instant-search-suggestion');
            searchbox.setupNavigation(suggestions);
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

  close() {
    if (this.isInputEmpty()) {
      this.result.empty();
      this.input.siblings('.instant-search-status').empty();
    }

    this.box.hide();
    this.input.attr('aria-expanded', false);
    this.input.removeAttr('aria-activedescendant');
  }

  open() {
    // Abort if the combobox is already open
    if (this.input.attr('aria-expanded') == 'true') {
      return;
    }

    if (this.isInputEmpty()) {
      return;
    }

    this.box.show();
    this.input.attr('aria-expanded', true);
  }

  /**
   * Informs the request status to assistive technologies.
   */
  setStatus() {
    var instantSearchStatus = this.input.siblings('.instant-search-status');
    var resultCount = this.result.children('.result-count').data('instantSearchStatus');

    instantSearchStatus.text(resultCount);
  }

  /**
   * Performs the Ajax request and returns the jqXHR object.
   */
  requestData() {
    var jqxhr = $.get(this.target, {query: this.query});

    return jqxhr;
  }

  setupNavigation(suggestions) {
    // Unbind the previous event handler
    this.input.off('keydown');

    this.input.blur(() => {
      this.close();
    });

    this.result.on('mousedown', '.instant-search-suggestion', function() {
      if (event.which == 1) {
        $(this).get(0).click();
      }

      event.preventDefault();
    });

    var selected = false;

    this.input.keydown(() => {
      switch(event.which) {
        case 38: // ARROW UP
          event.preventDefault();

          if (this.input.attr('aria-expanded') == 'false') {
            this.open();
            this.input.attr('aria-activedescendant', selected.attr('id'));

            break;
          }

          if (selected === false) {
            selected = suggestions.last();

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            this.input.attr('aria-activedescendant', selected.attr('id'));
          } else if (selected.is(suggestions.first())) {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');
            this.input.removeAttr('aria-activedescendant');

            selected = false;
          } else {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');

            selected = selected.prev('.instant-search-suggestion');

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            this.input.attr('aria-activedescendant', selected.attr('id'));
          }

          break;
        case 40: // ARROW DOWN
          event.preventDefault();

          if (this.input.attr('aria-expanded') == 'false') {
            this.open();
            this.input.attr('aria-activedescendant', selected.attr('id'));

            break;
          }

          if (selected === false) {
            selected = suggestions.first();

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            this.input.attr('aria-activedescendant', selected.attr('id'));
          } else if (selected.is(suggestions.last())) {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');
            this.input.removeAttr('aria-activedescendant');

            selected = false;
          } else {
            selected.removeClass('instant-search-cursor');
            selected.removeAttr('aria-selected');

            selected = selected.next('.instant-search-suggestion');

            selected.addClass('instant-search-cursor');
            selected.attr('aria-selected', true);
            this.input.attr('aria-activedescendant', selected.attr('id'));
          }

          break;
        case 27: // ESC
          event.preventDefault();

          this.close();

          break;
        case 13: // ENTER
          var selectedSuggestion = this.input.attr('aria-activedescendant');

          if (selectedSuggestion) {
            event.preventDefault();

            this.result.children('#' + selectedSuggestion).get(0).click();
          }

          break;
        case 9: // TAB
          this.close();

          break;
      }
    });
  }
}
