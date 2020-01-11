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
     * All toggle buttons on the current page.
     */
    this.buttons = $('.collapsible-toggle');

    /**
     * The currently selected toggle button.
     */
    this.button;

    /**
     * The target collapsible element of the currently selected toggle.
     */
    this.target;

    /**
     * All focusable items within the panel corresponding to the current target.
     */
    this.panelItems;

    /**
     * This boolean indicates whether the navigation panel was ever toggled.
     *
     * This is useful to prevent access to properties such as 'button' and
     * 'target', which are undefined until the first toggle is made.
     */
    this.initialized = false;

    this.keycode = {
      escape: 27,
      tab: 9,
      arrowUp: 38,
      arrowDown: 40
    };

    this.event = {
      namespace: '.navpanel',
      get click() {
        return 'click' + this.namespace;
      },
      get keyup() {
        return 'keyup' + this.namespace;
      },
      get keydown() {
        return 'keydown' + this.namespace;
      }
    };
  }

  setup() {
    var navPanel = this;

    this.buttons.each(function() {
      $(this).click(function(event) {
        event.stopPropagation();

        // If another navigation panel was left open, this will close it
        if (navPanel.initialized === true && navPanel.isExpanded()) {
          navPanel.hide();
        }

        let target = $(this).data('target');
        navPanel.target = $(target);
        navPanel.panelItems = navPanel.target.find('a');
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
    /*
     * The panel may be hidden via CSS at certain viewport sizes. In those
     * situations, our CSS transition will never fire. If the event listener
     * for 'transitionend' below is never executed, the panel will be locked
     * in a 'transition' state, and it will not work until the user reloads
     * the page. This prevents that from ever happening.
     */
    if (this.target.is(':hidden')) {
      return;
    }

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

    this.removeEphemeralEvents();
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

    this.addEphemeralEvents();
  }

  addEphemeralEvents() {
    $(document.body).on(this.event.click, () => {
      /*
       * Any clicks that bubble up to the document body will cause the panel
       * to collapse.
       */
      if (this.isTransitioning()) {
        return;
      }

      this.hide();
    });

    this.button.add(this.panelItems).keydown((event) => {
      if (event.which != this.keycode.escape) {
        return;
      }

      if (this.isTransitioning()) {
        return;
      }

      this.hide();

      // Return focus to the button when the panel collapses
      this.button.focus();
    });

    this.button.keydown((event) => {
      if (event.which != this.keycode.arrowUp && event.which != this.keycode.arrowDown) {
        return;
      }

      event.preventDefault();
      this.panelItems.first().focus();
    });

    this.panelItems.keydown((event) => {
      /*
       * Keyboard navigation through panel items using arrow keys.
       */
      var focused;

      this.panelItems.each(function() {
        var item = $(this);

        // Determine currently focused item
        if (item.is(document.activeElement)) {
          focused = item;
        }
      });

      if (event.which == this.keycode.arrowUp) {
        event.preventDefault();
        focused.prev().focus();
      }

      if (event.which == this.keycode.arrowDown) {
        event.preventDefault();
        focused.next().focus();
      }
    });

    this.panelItems.click(function(event) {
      event.stopPropagation();
    });

    $(document.body).on(this.event.keyup, (event) => {
      /*
       * TAB key events.
       *
       * This is responsible for collapsing the panel when keyboard focus
       * leaves any of the navigation panel elements.
       */
      if (event.which != this.keycode.tab) {
        return;
      }

      if (this.isTransitioning()) {
        return;
      }

      var focused = $(document.activeElement);

      if (focused.is(this.button) || focused.is(this.panelItems)) {
        return;
      }

      this.hide();
    });

    $(document.body).on(this.event.keydown, (event) => {
      /*
       * TAB key events that prevent the default action during a transition.
       *
       * Since a 'keyup' event is too late for preventDefault() to make any
       * difference, this handler should be bound to a keydown listener.
       */
      if (event.which != this.keycode.tab) {
        return;
      }

      if (!this.isTransitioning()) {
        return;
      }

      event.preventDefault();
    });
  }

  removeEphemeralEvents() {
    $(document.body).off(this.event.namespace);
    this.button.off('keydown');
    this.panelItems.off('keydown click');
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
