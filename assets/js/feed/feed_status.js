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

export default class FeedStatus {
  constructor(feed, feedData) {
    this.feed = feed;
    this.feedData = feedData;
    this.request = this.feed.children('.feed-request-status');
    this.messages = {
      ready: this.request.data('ready'),
      loading: this.request.data('loading'),
      error: this.request.data('error')
    };
    this.screens = {
      loading = this.feed.children('.feed-loading-screen'),
      error = this.feed.children('.feed-error-screen'),
      nothingHere = this.feed.children('.feed-nothing-here-screen'),
      nothingElse = this.feed.children('.feed-nothing-else-screen')
    };
    this.alert = $('<span>', {
      id: 'feed-request-error',
      class: 'sr-only',
      role: 'alert',
      text: this.messages.error
    });
  }

  loading() {
    this.request.text(this.messages.loading);
    this.feedData.attr('aria-busy', true);
  }

  ready() {
    this.request.text(this.messages.ready);
    this.feedData.attr('aria-busy', false);
  }

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
  }

  showNothingElseScreen() {
    this.screens.nothingElse.show();
  }

  showErrorScreen() {
    this.screens.error.removeClass('hidden');
  }

  buttonReady(feedControl) {
    var button = feedControl.children('.feed-load-more');

    button.children('.feed-ready-label').show();
    button.children('.feed-loading-label').hide();
    button.children('.feed-error-label').hide();

    feedControl.attr('aria-labelledby', 'feed-ready-label');
    button.prop('disabled', false);
    feedControl.show();
  }

  buttonLoading(feedControl) {
    var button = feedControl.children('.feed-load-more');

    button.children('.feed-loading-label').show();
    button.children('.feed-ready-label').hide();
    button.children('.feed-error-label').hide();

    feedControl.attr('aria-labelledby', 'feed-loading-label');
    button.prop('disabled', true);
    feedControl.show();
  }

  buttonError(feedControl) {
    var button = feedControl.children('.feed-load-more');

    button.children('.feed-error-label').show();
    button.children('.feed-loading-label').hide();
    button.children('.feed-ready-label').hide();

    button.removeClass('text-kabum-light-blue');
    button.addClass('text-strawberry');

    feedControl.attr('aria-labelledby', 'feed-error-label');
    button.prop('disabled', false);
    feedControl.show();
  }

  errorCheck(feedControl) {
    if (this.alert) {
      let button = feedControl.children('.feed-load-more');

      button.removeClass('text-strawberry');
      button.addClass('text-kabum-light-blue');

      this.alert.remove();
    }
  }
}
