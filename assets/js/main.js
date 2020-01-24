/**
 * Copyright 2019-2020 Douglas Silva (0x9fd287d56ec107ac)
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

require('../scss/main.scss');

const $ = require('jquery');
import SearchBox from './instant-search/searchbox.js';
const NavigationPanel = require('nav-panel');
import DepartmentsList from './departments-list/departments-list.js';
const Feed = require('feed-control');

$(document).ready(function() {
  var searchbox = new SearchBox();
  searchbox.startup();

  var navPanel = new NavigationPanel();
  navPanel.setup();

  var departmentsList = new DepartmentsList();
  departmentsList.setup();

  var feed = new Feed('feed');
  feed.setup();
});
