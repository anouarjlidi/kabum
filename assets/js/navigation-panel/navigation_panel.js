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

    this.keycode = {
      escape: 27
    };

    this.event = {
      namespace: '.navpanel',
      get click() {
        return 'click' + this.namespace;
      }
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

        // Prevent clicks on the toggle button from bubbling up to the document body
        event.stopPropagation();
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

    // Disable ephemeral event listeners
    $(document.body).off(this.event.click);
    this.button.off('keydown');
    this.target.find('a').off('keydown click');
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

    // Handle click events outside of the navigation panel component
    $(document.body).on(this.event.click, () => {
      this.hide();
    });

    // Handle keyboard shortcuts when focus is on the button
    this.button.keydown((event) => {
      this.escapeHandler(event);
    });

    // Handle keyboard shortcuts when focus is on the target menu items
    this.target.find('a').keydown((event) => {
      this.escapeHandler(event);
    });

    // Prevent clicks on menu items from bubbling up to the document body
    this.target.find('a').click(function(event) {
      event.stopPropagation();
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

    if (event.which == this.keycode.escape) {
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
