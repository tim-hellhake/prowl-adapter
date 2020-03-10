/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare module 'node-prowl' {
    export default class Prowl {
        constructor(key: string);
        push(event: string, application: string, options: { description: string }, callback: (err: string, remaining: number) => void): void;
    }
}
