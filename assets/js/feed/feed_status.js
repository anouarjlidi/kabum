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
  constructor(feed) {
    this.feed = feed;
    this.request = this.feed.children('.feed-request-status');
    this.feedData = this.feed.children('.feed-data');
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

  // FIXME: find a way to hide the loading screen
}
