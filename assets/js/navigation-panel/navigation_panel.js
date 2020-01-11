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

    /**
     * This boolean indicates whether the navigation panel was ever toggled.
     *
     * This is useful to prevent access to properties such as 'button' and
     * 'target', which are undefined until the first toggle is made.
     */
    this.initialized = false;

    this.keycode = {
      escape: 27,
      tab: 9
    };

    this.event = {
      namespace: '.navpanel',
      get click() {
        return 'click' + this.namespace;
      },
      get keyup() {
        return 'keyup' + this.namespace;
      }
    };
  }

  setup() {
    var navPanel = this;

    this.buttons.each(function() {
      $(this).click(function() {
        // Prevent clicks on the toggle button from bubbling up to the document body
        event.stopPropagation();

        // If another navigation panel was left open, this will close it
        if (navPanel.initialized === true && navPanel.isExpanded()) {
          navPanel.hide();
        }

        let target = $(this).data('target');
        navPanel.target = $(target);
        navPanel.button = $(this);

        if (navPanel.initialized === false) {
          navPanel.initialized = true;
        }

        navPanel.toggle();
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
    $(document.body).off(this.event.namespace);
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

    $(document.body).on(this.event.click, () => {
      /*
       * Any clicks that bubble up to the document body will cause the panel
       * to collapse.
       */
      this.hide();
    });

    this.button.keydown((event) => {
      this.escapeHandler(event);
    });

    this.target.find('a').keydown((event) => {
      this.escapeHandler(event);
    });

    this.target.find('a').click(function(event) {
      // Prevent clicks on panel items from bubbling up to the document body
      event.stopPropagation();
    });

    $(document.body).on(this.event.keyup, (event) => {
      this.tabHandler(event);
    });
  }

  /**
   * Event handler for ESC key events.
   */
  escapeHandler(event) {
    if (this.isTransitioning()) {
      return;
    }

    if (event.which == this.keycode.escape) {
      this.hide();

      // Returns focus to the button when the panel collapses
      this.button.focus();
    }
  }

  /**
   * Event handler for TAB key events.
   *
   * The panel collapses if focus leaves the toggle button or the menu items.
   */
  tabHandler() {
    if (event.which == this.keycode.tab) {
      var focused = $(document.activeElement);

      if (focused.is(this.button) || focused.is(this.target.find('a'))) {
        return;
      }

      this.hide();
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
