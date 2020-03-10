/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import {
  Adapter,
  Device
} from 'gateway-addon';

import Prowl from 'node-prowl';

class ProwlDevice extends Device {
  private callbacks: { [key: string]: (action: any) => void } = {};
  constructor(adapter: Adapter, manifest: any) {
    super(adapter, manifest.display_name);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;
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

  addCallbackAction(description: any, callback: (action: any) => void) {
    this.addAction(description.title, description);
    this.callbacks[description.title] = callback;
  }

  async performAction(action: any) {
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

export class ProwlAdapter extends Adapter {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, ProwlAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const prowl = new ProwlDevice(this, manifest);
    this.handleDeviceAdded(prowl);
  }
}
