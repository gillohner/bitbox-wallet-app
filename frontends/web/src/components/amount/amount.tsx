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
import style from './amount.module.css';
import { CoinUnit, ConversionUnit } from './../../api/account';

type TProps = {
  amount: string;
  unit: CoinUnit | ConversionUnit;
  removeBtcTrailingZeroes?: boolean;
};

export const Amount = ({ amount, unit, removeBtcTrailingZeroes }: TProps) => {
  const formatSats = (amount: string): JSX.Element => {
    const blocks: JSX.Element[] = [];
    const blockSize = 3;

    for (let i = amount.length; i > 0 ; i -= blockSize) {
      const start = Math.max(0, i - blockSize);

      blocks.push(
        <span key={'block_' + blocks.length} className={start === 0 ? '' : style.space}>
          {amount.slice(start, i)}
        </span>
      );
    }

    return <span data-testid={'amountBlocks'}>{blocks.reverse()}</span>;
  };

  const formatBtc = (amount: string): JSX.Element => {
    const dot = amount.indexOf('.');
    if (dot === -1) {
      return <>{amount}</>;
    }
    return <span data-testid={'amountBlocks'}>
      <span>{amount.slice(0, dot + 3)}</span>
      <span className={style.space}>{amount.slice(dot + 3, dot + 6)}</span>
      <span className={style.space}>{amount.slice(dot + 6, dot + 9)}</span>
    </span>;
  };

  switch (unit) {
  case 'BTC':
  case 'TBTC':
  case 'LTC':
  case 'TLTC':
    if (removeBtcTrailingZeroes && amount.includes('.')) {
      return <>{amount.replace(/\.?0+$/, '')}</>;
    } else {
      return formatBtc(amount);
    }
  case 'sat':
  case 'tsat':
    return formatSats(amount);
  }
  return <>{amount}</>;

};
