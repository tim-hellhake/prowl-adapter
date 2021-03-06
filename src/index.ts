/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { ProwlAdapter } from './prowl-adapter';
import { ProwlNotifier } from './prowl-notifier';

export = (addonManager: any, manifest: any) => {
    new ProwlAdapter(addonManager, manifest);
    new ProwlNotifier(addonManager, manifest);
};
