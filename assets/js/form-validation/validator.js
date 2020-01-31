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

/**
 * Perform client-side form validation using Bootstrap's custom styles.
 *
 * Validation feedback is applied when the submit button is pressed.
 */
export default class FormValidator {
  constructor() {
    this.forms = document.getElementsByClassName('needs-validation');
    this.passwordWrappers = document.getElementsByClassName('validator-password');
  }

  setup() {
    for (let form of this.forms) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();

          form.classList.add('was-validated');
        }
      });
    }

    this.passwordRepeat();
  }

  /**
   * Validates a 'repeat password' field.
   *
   * Fields used to set a password are validated by testing if the value from
   * one field matches the value on the other.
   */
  passwordRepeat() {
    for (let wrapper of this.passwordWrappers) {
      var inputElements = wrapper.querySelectorAll('.validator-password-first, .validator-password-second');

      inputElements.forEach(function(currentValue, currentIndex, listObj) {
        currentValue.addEventListener('input', function(event) {
          var first = listObj.item(0);
          var second = listObj.item(1);

          if (first.value !== second.value) {
            first.setCustomValidity('#');
            second.setCustomValidity('#');
          } else {
            first.setCustomValidity('');
            second.setCustomValidity('');
          }
        });
      });
    }
  }
}
