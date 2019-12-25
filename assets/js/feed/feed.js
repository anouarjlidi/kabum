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
import FeedStatus from './feed_status.js';

export default class Feed {
  constructor(name) {
    this.feed = $(name);
    this.feedData = this.feed.children('.feed-data');
    this.feedControl = null;
    this.page = 1;
    this.itemCount = 1;
    this.status = new FeedStatus(this.feed, this.feedData);
    this.slug = this.feedData.data('slug');
  }

  setup() {
    this.status.loading();
    var request = this.loadPage();

    request
      .done(data => {
        this.status.hideLoadingScreen();
        this.feedData.append(data);
        this.setItemPosition();

        var metadata = this.feedData.children('article').first();
        this.feedControl = this.feedData.children('.feed-control');

        if (metadata.data('numberOfResults') > metadata.data('pageSize')) {
          this.status.buttonReady(this.feedControl);
          this.setItemCount();
        } else if (metadata.data('numberOfResults') === undefined) {
          this.feedData.hide();
          this.status.showNothingHereScreen();
        } else {
          this.status.showNothingElseScreen();
          this.itemCount--;
          this.setItemCount();
        }

        this.status.ready();
        this.setupFeedControl();
        this.setupNavigation();
      })
      .fail(() => {
        this.status.hideLoadingScreen();
        this.status.showErrorScreen();
        this.status.error();
      });
  }

  loadPage() {
    var jqxhr = $.get(this.slug, {page: this.page});

    return jqxhr;
  }

  setupFeedControl() {
    this.page++;

    this.feedData.on('click', '.feed-load-more', () => {
      this.status.loading();

      var button = this.feedControl.children('.feed-load-more');

      this.status.buttonLoading(this.feedControl);
      this.status.errorCheck(this.feedControl);

      var request = this.loadPage();

      request
        .done((data, button) => {
          button.remove();
          this.feedData.append(data);
          this.page++;
          this.setItemPosition();

          var metadata = this.feedData.children('article').first();

          if (this.page > metadata.data('lastPage')) {
            this.status.showNothingElseScreen();
            this.itemCount--;
            this.setItemCount();
          } else {
            this.status.buttonReady(this.feedControl);
            this.setItemCount();
          }

          $('.focus-me').last().focus();

          this.status.ready();
        })
        .fail(() => {
          this.status.buttonError(this.feedControl);
          this.status.error();
        });
    });
  }

  setupNavigation() {
    this.feedData.keydown(event => {
      var target = $(event.target);

      if (target.is(':not(article)')) {
        target = target.closest('article');
      }

      var itemPosition = target.attr('aria-posinset');

      switch(event.which) {
        case 33: // PAGE_UP
          event.preventDefault();

          if (itemPosition > 1) {
            itemPosition--;
            $('[aria-posinset="' + itemPosition + '"]').focus();
          }

          break;
        case 34: // PAGE_DOWN
          event.preventDefault();

          if (itemPosition < this.itemCount) {
            itemPosition++;
            $('[aria-posinset="' + itemPosition + '"]').focus();
          }

          break;
        case 35: // CTRL + END
          if (event.ctrlKey) {
            event.preventDefault();

            if (itemPosition !== this.itemCount) {
              $('[aria-posinset="' + this.itemCount + '"]').focus();
            }
          }

          break;
        case 36: // CTRL + HOME
          if (event.ctrlKey) {
            event.preventDefault();

            if (itemPosition !== 1) {
              $('[aria-posinset="1"]').focus();
            }
          }

          break;
      }
    });
  }

  setItemPosition() {
    var feed = this;

    $('.feed-new-item').each(function(feed) {
      $(this).attr('aria-posinset', feed.itemCount);
      feed.itemCount++;
      $(this).removeClass('feed-new-item');
    });

    this.itemCount--;
  }

  setItemCount() {
    var feed = this;

    this.feedData.children().each(function(feed) {
      $(this).attr('aria-setsize', feed.itemCount);
    });
  }
}
