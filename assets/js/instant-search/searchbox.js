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
    /**
     * All SearchBox widgets found on the page.
     */
    this.instances = $('.instant-search-input');

    /**
     * The currently selected input element.
     */
    this.input;

    /**
     * The search terms used in the database query.
     */
    this.query;

    /**
     * Path to the server-side controller responsible for answering
     * the request.
     */
    this.target;

    /**
     * The combobox popup menu.
     */
    this.box;

    /**
     * The container the requested data gets pushed into.
     */
    this.result;
  }

  startup() {
    // Abort if instant search is not implemented in the current page
    if (!this.findInstantSearch()) {
      return;
    }

    var searchbox = this;

    this.instances.each(function() {
      $(this).on('input', function() {
        searchbox.input = $(this);
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
            // Wipe aria-activedescendant when a new query is made
            searchbox.input.removeAttr('aria-activedescendant');

            searchbox.result.html(data);
            searchbox.open();

            /*
             * Select all search results returned by the server, which are
             * then used in keyboard navigation.
             */
            var suggestions = searchbox.result.children('.instant-search-suggestion');
            searchbox.setupNavigation(suggestions);
          });
      });
    });
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
   * Close the combobox popup menu.
   *
   * If the search query is empty, it will also discard the currently
   * loaded search results.
   */
  close() {
    if (this.isInputEmpty()) {
      this.result.empty();
    }

    this.box.hide();
    this.input.attr('aria-expanded', false);
    this.input.removeAttr('aria-activedescendant');
  }

  /**
   * Open the combobox popup menu.
   */
  open() {
    // Abort if the combobox is already expanded
    if (this.input.attr('aria-expanded') == 'true') {
      return;
    }

    /*
     * Keyboard navigation event handlers will want to abort when the
     * search query is empty.
     */
    if (this.isInputEmpty()) {
      return;
    }

    this.box.show();
    this.input.attr('aria-expanded', true);
  }

  /**
   * Opens the combobox popup menu.
   *
   * The difference between this and open() is that this method is meant to
   * be called from the keyboard navigation event handlers. It is used to open
   * the popup menu at the press of navigation keys.
   *
   * This method makes sure the last selected item is remembered when
   * the menu opens, as recommended by the W3C standards on Managing Focus.
   *
   * It returns a boolean to allow further action when it is called. True is
   * returned when the menu opens, otherwise it returns false.
   *
   * The 'selected' parameter is a jQuery object that represents the currently
   * selected menu item.
   */
  reopen(selected) {
    // Open the menu only if it's collapsed
    if (this.input.attr('aria-expanded') == 'false') {
      this.open();

      // Set the last aria-activedescendant value, unless the search query is empty
      if (!this.isInputEmpty()) {
        this.input.attr('aria-activedescendant', selected.attr('id'));
      }

      return true;
    }

    return false;
  }

  /**
   * Performs the Ajax request and returns the jqXHR object.
   */
  requestData() {
    var jqxhr = $.get(this.target, {query: this.query});

    return jqxhr;
  }

  /**
   * Configures navigation event handlers.
   *
   * The 'suggestions' parameter is a jQuery object that represents all
   * currently loaded menu items.
   */
  setupNavigation(suggestions) {
    /*
     * Unbind any previously bound navigation event handlers, as they are
     * reattached on every 'input' event.
     */
    this.input.off('keydown blur mousedown');

    // Close the menu when it loses focus
    this.input.blur(() => {
      this.close();
    });

    /*
     * Because of the blur event handler, clicking on any menu items will
     * cause the menu to close without executing the expected action. Using
     * the 'mousedown' event and listening for a left button press will
     * allow the client to activate these items with the mouse.
     */
    this.result.on('mousedown', '.instant-search-suggestion', function() {
      if (event.which == 1) { // Left mouse button key code
        $(this).get(0).click();
      }

      event.preventDefault();
    });

    /*
     * The 'false' value represents a selection void - a state in which none of
     * the menu items are selected. If the form is activated like this, it will
     * execute the form action and it won't read the aria-activedescendant value.
     */
    var selected = false;

    this.input.keydown(() => {
      switch(event.which) {
        case 38: // ARROW UP
          event.preventDefault();

          if (this.reopen(selected)) {
            break;
          }

          if (selected === false) {
            selected = suggestions.last();
            this.setCursor(selected);
          } else if (selected.is(suggestions.first())) {
            this.removeCursor(selected);
            selected = false;
          } else {
            this.removeCursor(selected);
            selected = selected.prev('.instant-search-suggestion');
            this.setCursor(selected);
          }

          break;
        case 40: // ARROW DOWN
          event.preventDefault();

          if (this.reopen(selected)) {
            break;
          }

          if (selected === false) {
            selected = suggestions.first();
            this.setCursor(selected);
          } else if (selected.is(suggestions.last())) {
            this.removeCursor(selected);
            selected = false;
          } else {
            this.removeCursor(selected);
            selected = selected.next('.instant-search-suggestion');
            this.setCursor(selected);
          }

          break;
        case 27: // ESC
          event.preventDefault();

          this.close();

          break;
        case 13: // ENTER
          var selectedSuggestion = this.input.attr('aria-activedescendant');

          /*
           * If aria-activedescendant is set, it will find the menu item to
           * which it refers and trigger a click on it.
           */
          if (selectedSuggestion) {
            event.preventDefault();

            this.result.children('#' + selectedSuggestion).get(0).click();
          }

          break;
      }
    });
  }

  /**
   * Applies visual and accessible identification of the currently selected
   * menu item.
   */
  setCursor(selected) {
    selected.addClass('instant-search-cursor');
    selected.attr('aria-selected', true);
    this.input.attr('aria-activedescendant', selected.attr('id'));
  }

  /**
   * Removes menu item selection cues.
   */
  removeCursor(selected) {
    selected.removeClass('instant-search-cursor');
    selected.removeAttr('aria-selected');
    this.input.removeAttr('aria-activedescendant');
  }
}
