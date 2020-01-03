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
 * Feed status controller.
 *
 * Handles contextual changes to the feed.
 */
export default class FeedStatus {
  constructor(feed, feedData) {
    this.feed = feed;
    this.feedData = feedData;

    /**
     * The request element sends a status message to screen readers whenever
     * it changes, because of the 'status' role.
     *
     * Messages are pushed into the request, which informs the screen reader
     * about the change.
     */
    this.request = this.feed.children('.feed-request-status');

    this.messages = {
      ready: this.request.data('ready'),
      loading: this.request.data('loading'),
      error: this.request.data('error')
    };

    /**
     * Screens are large placeholder elements commonly used to indicate
     * a busy state, errors and other status information.
     *
     * Screens should not be used after the initial request, when items are
     * already loaded onto the page. For anything after that, use button labels
     * instead.
     */
    this.screens = {
      loading: this.feed.children('.feed-loading-screen'),
      error: this.feed.children('.feed-error-screen'),
      nothingHere: this.feed.children('.feed-nothing-here-screen')
    };

    this.alert = $('<span>', {
      id: 'feed-request-error',
      class: 'sr-only',
      role: 'alert',
      text: this.messages.error
    });
  }

  /**
   * Inform screen readers that the feed is about to change.
   */
  loading() {
    this.request.text(this.messages.loading);
    this.feedData.attr('aria-busy', true);
  }

  /**
   * Inform screen readers that the feed is ready.
   */
  ready() {
    this.request.text(this.messages.ready);
    this.feedData.attr('aria-busy', false);
  }

  /**
   * Dispatch an error alert to screen readers.
   */
  error() {
    this.request.empty();
    this.alert.insertAfter(this.request);
    this.feedData.attr('aria-busy', false);
  }

  hideLoadingScreen() {
    this.screens.loading.addClass('hidden');
  }

  showNothingHereScreen() {
    this.screens.nothingHere.removeClass('hidden');
    this.feedData.hide();
  }

  showErrorScreen() {
    this.screens.error.removeClass('hidden');
    this.feedData.hide();
  }

  /**
   * Set the feed control label to the ready state.
   */
  feedControlReady(feedControl) {
    var button = feedControl.children('.feed-control-label-ready');
    var label = button.data('label');

    button.show();
    button.siblings('.feed-control-label').hide();

    feedControl.attr('aria-labelledby', label);
    feedControl.show();
  }

  /**
   * Set the feed control label to the loading state.
   */
  feedControlLoading(feedControl) {
    var button = feedControl.children('.feed-control-label-loading');
    var label = button.data('label');

    button.show();
    button.siblings('.feed-control-label').hide();

    feedControl.attr('aria-labelledby', label);
    feedControl.show();
  }

  /**
   * Set the feed control label to the error state.
   */
  feedControlError(feedControl) {
    var button = feedControl.children('.feed-control-label-error');
    var label = button.data('label');

    button.show();
    button.siblings('.feed-control-label').hide();

    feedControl.attr('aria-labelledby', label);
    feedControl.show();
  }

  /**
   * Set the feed control label to the nothing else state.
   */
  feedControlNothingElse(feedControl) {
    var button = feedControl.children('.feed-control-label-nothing-else');
    var label = button.data('label');

    button.show();
    button.siblings('.feed-control-label').hide();

    feedControl.attr('aria-labelledby', label);
    feedControl.show();
  }

  /**
   * Removes obsolete error alerts.
   */
  errorCheck() {
    if (this.alert) {
      this.alert.remove();
    }
  }
}
