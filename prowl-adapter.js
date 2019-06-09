/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Prowl = require('node-prowl');

const {
  Adapter,
  Device,
} = require('gateway-addon');

class ProwlDevice extends Device {
  constructor(adapter, manifest) {
    super(adapter, 'Prowl');
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;
    this.callbacks = {};
    const prowl = new Prowl(manifest.moziot.config.apiKey);

    this.addCallbackAction({
      title: 'push',
      description: 'Push a notification',
      input: {
        type: 'object',
        properties: {
          application: {
            type: 'string'
          },
          event: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    }, (action) => {
      const {
        event,
        application,
        description
      } = action.input;

      const options = {
        description
      };

      // eslint-disable-next-line max-len
      prowl.push(event, application, options, (err, remaining) => {
        if (err) {
          console.error('Could not send push %s', err);
        }

        console.log('%i remaining calls for this api key', remaining);
      });
    });

    if (manifest.moziot.config.messages) {
      for (const message of manifest.moziot.config.messages) {
        const {
          name,
          application,
          event,
          description
        } = message;

        console.log(`Creating action for ${name}`);

        this.addCallbackAction({
          title: name,
          description: 'Push a notification'
        }, () => {
          const options = {
            description
          };

          prowl.push(event, application, options, (err, remaining) => {
            if (err) {
              console.error('Could not send push %s', err);
            }

            console.log('%i remaining calls for this api key', remaining);
          });
        });
      }
    }
  }

  addCallbackAction(description, callback) {
    this.addAction(description.title, description);
    this.callbacks[description.title] = callback;
  }

  async performAction(action) {
    action.start();

    const callback = this.callbacks[action.name];

    if (callback) {
      callback(action);
    } else {
      console.warn(`Unknown action ${action.name}`);
    }

    action.finish();
  }
}

class ProwlAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, ProwlAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const prowl = new ProwlDevice(this, manifest);
    this.handleDeviceAdded(prowl);
  }
}

module.exports = ProwlAdapter;
