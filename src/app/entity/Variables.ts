import { Injectable } from '@angular/core';

@Injectable()
export class Key {
  key: string = 'hackerkaidagalbanisbaby'.split('').reverse().join('');
  key2: string = 'hackerkaidagalbanisbro'.split('').reverse().join('');

  public count: number;
  public status: boolean;
  public timerCtrl: boolean;
}
