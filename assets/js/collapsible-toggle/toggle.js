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
 * Toggle the visibility of content.
 *
 * It applies a transition effect on the element's width. It works similarly
 * to Bootstrap's Collapse component.
 */
export default class CollapsibleToggle {
  constructor() {
    /**
     * All instances of collapsible toggles on the current page.
     */
    this.buttons = $('.collapsible-toggle');

    /**
     * The currently selected toggle button.
     */
    this.button;

    /**
     * The collapsible element of the currently selected toggle button.
     */
    this.target;
  }

  setup() {
    var collapsibleToggle = this;

    this.buttons.each(function() {
      $(this).click(function() {
        let target = $(this).data('target');
        collapsibleToggle.target = $(target);
        collapsibleToggle.button = $(this);

        collapsibleToggle.toggle();
      });
    });
  }

  toggle() {
    /*
     * Ignore button presses during transition. This prevents glitchy behavior.
     */
    if (this.target.hasClass('transitioning')) {
      return;
    }

    if (this.target.hasClass('expanded')) {
      this.hide();

      return;
    }

    this.show();
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
}
