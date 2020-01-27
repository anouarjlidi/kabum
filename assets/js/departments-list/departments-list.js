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

const $ = require('jquery');
const routes = require('../../../public/fos_js_routes.json');
import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js';

Routing.setRoutingData(routes);

/**
 * Fetch and render the departments list.
 */
export default class DepartmentsList {
  constructor() {
    /**
     * All instances of department lists.
     */
    this.departmentLists = $('.category-list');

    /**
     * The path used to make the Ajax request.
     */
    this.target;

    /**
     * If the slug for a department exists in the current route, it will be
     * passed here so we can indicate on the list which department represents
     * the current page.
     */
    this.currentSlug;

    /**
     * The JSON data received from the server.
     */
    this.data;
  }

  setup() {
    var departmentsList = this;

    this.departmentLists.each(function() {
      var currentList = $(this);

      departmentsList.target = currentList.data('target');
      departmentsList.currentSlug = currentList.data('categorySlug');

      var request = departmentsList.requestData();

      request
        .done(function(data) {
          departmentsList.data = data;

          $.each(departmentsList.data.categories, function(index, department) {
            var template = departmentsList.getTemplate(department);

            // Insert the template first
            currentList.append(template);

            // Then use the XSS-safe text() method to set its name
            template.text(department.name);
          });
        });
    });
  }

  /**
   * Requests the JSON data from the server and returns a jqXHR object.
   */
  requestData() {
    var jqxhr = $.getJSON(this.target);

    return jqxhr;
  }

  /**
   * Returns an HTML template for a department item.
   *
   * The 'department' argument must be a department object from the parsed
   * JSON data.
   */
  getTemplate(department) {
    // Identify the current page
    if (this.currentSlug == department.slug) {
      var template = $('<a>', {
        'class': 'category current-category',
        'href': Routing.generate('category_page', {category_slug: department.slug}),
        'aria-current': 'page',
      });
    } else {
      var template = $('<a>', {
        'class': 'category',
        'href': Routing.generate('category_page', {category_slug: department.slug}),
      });
    }

    return template;
  }
}
