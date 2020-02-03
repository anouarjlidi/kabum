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

    /**
     * These strings are set using setCustomValidity() and are caught during
     * validation. They help distinguish between custom errors and take
     * the most appropriate action.
     */
    this.error = {
      none: '',
      password: 'password_match_error'
    };

    this.handler = {
      main: undefined
    }
  }

  setup() {
    for (let form of this.forms) {
      form.addEventListener('submit', (event) => {
        let separator = ',';
        let input = 'input:not([type="submit"]):not([type="hidden"]):not([type="checkbox"]):not([type="file"])';
        let select = 'select';
        let textarea = 'textarea';
        let selector = input + separator + select + separator + textarea;
        var inputElements = form.querySelectorAll(selector);

        inputElements.forEach((currentValue, currentIndex, listObj) => {
          // Call main validation handler once on submit
          this.validation(form, currentValue);

          this.handler.main = (event) => {
            this.validation(form, currentValue);
          }

          // Call main validation handler on input
          currentValue.removeEventListener('input', this.handler.main);
          currentValue.addEventListener('input', this.handler.main);
        });

        if (form.checkValidity() === false) {
          event.preventDefault();

          form.classList.add('was-validated');
        }
      });
    }
  }

  /**
   * Check if the value of two password fields match.
   *
   * This is a custom validation constraint.
   */
  passwordValidation(form) {
    var inputElements = form.querySelectorAll('.validator-password-first, .validator-password-second');

    inputElements.forEach((currentValue, currentIndex, listObj) => {
      var first = listObj.item(0);
      var second = listObj.item(1);

      // Abort if both fields are empty
      if (!first.value && !second.value) {
        return;
      }

      if (first.value !== second.value) {
        first.setCustomValidity(this.error.password);
        second.setCustomValidity(this.error.password);
      } else {
        first.setCustomValidity(this.error.none);
        second.setCustomValidity(this.error.none);
      }
    });

    return inputElements;
  }

  /**
   * Main validation handler.
   *
   * It will check for any constraint violation on the provided input element
   * and set a feedback message.
   */
  async validation(form, input) {
    // Call custom validation constraint methods here
    var passwordInputElements = await this.passwordValidation(form);

    var error = input.nextElementSibling;
    var errorBox = error.querySelector('.validator-message');

    if (input.validity.valueMissing) {
      errorBox.textContent = error.dataset.empty;
      error.setAttribute('role', 'alert');

      return;
    }

    if (input.validity.tooShort) {
      errorBox.textContent = error.dataset.tooShort;
      error.setAttribute('role', 'alert');

      return;
    }

    if (input.validity.tooLong) {
      errorBox.textContent = error.dataset.tooLong;
      error.setAttribute('role', 'alert');

      return;
    }

    if (input.validity.patternMismatch) {
      errorBox.textContent = error.dataset.pattern;
      error.setAttribute('role', 'alert');

      return;
    }

    if (input.validity.customError) {
      if (input.validationMessage == this.error.password) {
        var first = passwordInputElements.item(0);
        var second = passwordInputElements.item(1);

        var errorFirst = first.nextElementSibling;
        var errorSecond = second.nextElementSibling;

        var errorBoxFirst = errorFirst.querySelector('.validator-message');
        var errorBoxSecond = errorSecond.querySelector('.validator-message');

        errorBoxFirst.textContent = errorFirst.dataset.passwordMatch;
        errorBoxSecond.textContent = errorSecond.dataset.passwordMatch;
        errorFirst.setAttribute('role', 'alert');
        errorSecond.setAttribute('role', 'alert');

        return;
      }

      throw 'Unknown custom constraint violation.';
    }

    // No constraint violations found
    error.removeAttribute('role', 'alert');
  }
}
