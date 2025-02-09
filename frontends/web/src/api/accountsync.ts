/**
 * Copyright 2023 Shift Crypto AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TUnsubscribe } from '../utils/transport-common';
import { subscribeEndpoint } from './subscribe';
import { subscribe as subscribeLegacy } from '../utils/event-legacy';
import { IAccount } from './account';

/**
 * Subscribes the given function on the "account" event and receives the
 * list of all available accounts from the backend.
 * Returns a method to unsubscribe.
 */
export const syncAccountsList = (
  cb: (accounts: IAccount[],) => void
): TUnsubscribe => {
  return subscribeEndpoint('accounts', cb);
};

/**
 * Subscribes the given function on an "account/<CODE>/synced-addresses-count" event
 * to receive the progress of the address sync.
 * Returns a method to unsubscribe.
 */
export const syncAddressesCount = (
  code: string,
  cb: (code: string, syncedAddressesCount: number) => void,
): TUnsubscribe => {
  return subscribeEndpoint(`account/${code}/synced-addresses-count`, (
    data: number,
  ) => {
    cb(code, data);
  });
};

/**
 * Fired when status of an account changed, mostly
 * used as event to call accountApi.getStatus(code).
 * Returns a method to unsubscribe.
 */
export const statusChanged = (
  code: string,
  cb: (code: string) => void,
): TUnsubscribe => {
  const unsubscribe = subscribeLegacy('statusChanged', event => {
    if (event.type === 'account' && event.code === code) {
      cb(code);
    }
  });
  return unsubscribe;
};

/**
 * Fired when the account is fully synced.
 * Returns a method to unsubscribe.
 */
export const syncdone = (
  code: string,
  cb: (code: string) => void,
): TUnsubscribe => {
  return subscribeLegacy('syncdone', event => {
    if (event.type === 'account' && event.code === code) {
      cb(code);
    }
  });
};
