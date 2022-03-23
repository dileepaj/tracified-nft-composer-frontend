import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  hidden: boolean = false;
  constructor() {}

  public toggleNav() {
    this.hidden = !this.hidden;
  }

  public getHiddenStatus() {
    return this.hidden;
  }
}
