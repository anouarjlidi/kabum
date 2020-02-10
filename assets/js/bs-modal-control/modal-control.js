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
 * Handle Bootstrap Modal dialogs.
 *
 * This is responsible for passing data from the modal trigger
 * to the modal dialog.
 */
export default class ModalControl {
  constructor() {
    /**
     * The target modal.
     */
    this.modal;

    /**
     * The URI used for the primary action of the modal.
     */
    this.action;

    /**
     * The title of the modal.
     */
    this.title;
  }

  init() {
    document.addEventListener('click', (event) => {
      var trigger = event.target.closest('.bs-modal-trigger');

      if (!trigger) {
        return;
      }

      this.modal = document.querySelector(trigger.dataset.target);
      this.action = trigger.dataset.action;
      this.title = trigger.dataset.title;

      this.setTitle();
      this.setAction();
    });
  }

  setTitle() {
    var title = this.modal.querySelector('.bs-modal-title');

    title.textContent = this.title;
  }

  setAction() {
    var form = this.modal.querySelector('.bs-modal-action');

    form.setAttribute('action', this.action);
  }
}
