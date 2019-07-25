/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Prowl = require('node-prowl');

const {
  Constants,
  Notifier,
  Outlet,
} = require('gateway-addon');

class ProwlOutlet extends Outlet {
  constructor(notifier, id, config) {
    super(notifier, id);
    this.name = 'Pushover';
    this.config = config;
    this.prowl = new Prowl(config.apiKey);
  }

  notify(title, message, level) {
    let priority = 0;

    switch (level) {
      case Constants.NotificationLevel.LOW:
        priority = -1;
        break;
      case Constants.NotificationLevel.NORMAL:
        priority = 0;
        break;
      case Constants.NotificationLevel.HIGH:
        priority = 1;
        break;
    }

    const options = {
      description: message,
      priority,
    };

    return new Promise((resolve, reject) => {
      this.prowl.push(title, 'WebThings Gateway', options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

class ProwlNotifier extends Notifier {
  constructor(addonManager, manifest) {
    super(addonManager, ProwlNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets[ProwlNotifier.name]) {
      this.handleOutletAdded(
        new ProwlOutlet(this, ProwlNotifier.name, manifest.moziot.config)
      );
    }
  }
}

module.exports = ProwlNotifier;
