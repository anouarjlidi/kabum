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
 * Validates all fields on submit, and each field on input.
 */
export default class FormValidator {
  constructor() {
    this.forms = document.getElementsByClassName('needs-validation');

    /**
     * These strings are set using setCustomValidity() and are caught during
     * validation. They help distinguish between custom constraint violations.
     */
    this.constraint = {
      none: '',
      password: 'password_match_error'
    };

    this.handler = {
      main: undefined
    };

    /**
     * These strings are used to retrieve feedback messages from the dataset.
     */
    this.feedback = {
      empty: 'empty',
      tooShort: 'tooShort',
      tooLong: 'tooLong',
      pattern: 'pattern',
      passwordMatch: 'passwordMatch'
    };
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
   * Main validation handler.
   */
  async validation(form, input) {
    // Run any custom constraint methods first
    await this.validatePassword(form);

    this.validateAll(input);
  }

  /**
   * Check for any constraint violations on the provided form field.
   */
  validateAll(input) {
    if (input.validity.valueMissing) {
      this.setFeedback(input, this.feedback.empty);

      return;
    }

    if (input.validity.tooShort) {
      this.setFeedback(input, this.feedback.tooShort);

      return;
    }

    if (input.validity.tooLong) {
      this.setFeedback(input, this.feedback.tooLong);

      return;
    }

    if (input.validity.patternMismatch) {
      this.setFeedback(input, this.feedback.pattern);

      return;
    }

    if (input.validity.customError) {
      if (input.validationMessage == this.constraint.password) {
        this.setFeedback(input, this.feedback.passwordMatch);

        return;
      }

      throw 'Unknown custom constraint violation.';
    }

    // No constraint violations found
    this.removeFeedback(input);
  }

  /**
   * Set a feedback message on a form field.
   */
  setFeedback(input, feedback) {
    let errorBox = input.nextElementSibling;
    let errorMessageBox = errorBox.querySelector('.validator-message');
    let message = errorBox.dataset[feedback];

    errorMessageBox.textContent = message;
    errorBox.setAttribute('role', 'alert');
  }

  /**
   * Remove the feedback message from a form field.
   */
  removeFeedback(input) {
    let errorBox = input.nextElementSibling;
    let errorMessageBox = errorBox.querySelector('.validator-message');

    errorMessageBox.textContent = '';
    errorBox.removeAttribute('role');
  }

  /**
   * Check if the value of two password fields match.
   *
   * This is a custom validation constraint.
   */
  validatePassword(form) {
    var first = form.querySelector('.validator-password-first');
    var second = form.querySelector('.validator-password-second');

    // Abort if password validation fields are not found
    if (!first || !second) {
      return;
    }

    // Will not validate if the first field doesn't have a value
    if (!first.value) {
      second.removeAttribute('required');
      second.setCustomValidity(this.constraint.none);
      this.validateAll(second);

      return;
    }

    // The first field has a value, so the second becomes required
    second.setAttribute('required', 'required');
    this.validateAll(second);

    // Will not validate if the second field doesn't have a value
    if (!second.value) {
      return;
    }

    // Test if the value of the first and second fields match
    if (first.value === second.value) {
      second.setCustomValidity(this.constraint.none);
      this.validateAll(second);
    } else {
      second.setCustomValidity(this.constraint.password);
      this.validateAll(second);
    }
  }
}
