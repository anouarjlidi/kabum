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
 * A collapsible navigation panel.
 */
export default class NavigationPanel {
  constructor() {
    /**
     * All toggles on the current page.
     */
    this.buttons = $('.collapsible-toggle');

    /**
     * The currently selected toggle button.
     */
    this.button;

    /**
     * The target element of the currently selected toggle.
     */
    this.target;

    this.keycodes = {
      escape: 27
    };
  }

  setup() {
    var navPanel = this;

    this.buttons.each(function() {
      $(this).click(function() {
        let target = $(this).data('target');
        navPanel.target = $(target);
        navPanel.button = $(this);

        navPanel.toggle();
      });

      $(this).keydown(function(event) {
        let target = $(this).data('target');
        navPanel.target = $(target);
        navPanel.button = $(this);

        navPanel.escapeHandler(event);
      });

      // Event listener for all navigation panel items
      $(this).siblings('.collapsible').find('a').keydown(function(event) {
        navPanel.escapeHandler(event);
      });
    });
  }

  toggle() {
    if (this.isTransitioning()) {
      return;
    }

    if (this.isExpanded()) {
      this.hide();
    } else {
      this.show();
    }
  }

  hide() {
    // Add the transition effect
    this.target.addClass('transitioning');

    // Maintain visibility of the item during transition
    this.target.removeClass('collapsible');
    this.target.removeClass('expanded');

    // Reset the width so the 'transitioning' class can set it to zero
    this.target.width('');

    var button = this.button;

    this.target.one("transitionend", function() {
      $(this).removeClass('transitioning');
      $(this).addClass('collapsible');
      button.attr('aria-expanded', false);
    });
  }

  show() {
    // Get the collapsible element's width in pixels and convert it to rem units
    let targetWidth = this.target.width() / 16;

    // Restore target element visibility and apply transition
    this.target.removeClass('collapsible');
    this.target.addClass('transitioning');

    // Set the width to trigger the transition effect
    this.target.width(targetWidth + 'rem');

    var button = this.button;

    this.target.one("transitionend", function() {
      $(this).removeClass('transitioning');
      $(this).addClass('collapsible');
      $(this).addClass('expanded');
      button.attr('aria-expanded', true);
    });
  }

  /**
   * Event handler for ESC key events.
   */
  escapeHandler(event) {
    if (this.isTransitioning()) {
      return;
    }

    if (!this.isExpanded()) {
      return;
    }

    if (event.which == this.keycodes.escape) {
      this.hide();

      // Prevents unexpected focus placement when the panel collapses
      this.button.focus();
    }
  }

  /**
   * Detect a CSS transition in progress.
   *
   * This can be used to prevent glitchy behavior.
   */
  isTransitioning() {
    if (this.target.hasClass('transitioning')) {
      return true;
    }

    return false;
  }

  /**
   * Check if the navigation panel is activated/expanded.
   */
  isExpanded() {
    if (this.target.hasClass('expanded')) {
      return true;
    }

    return false;
  }
}
