import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterState} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tracified-nft-composer-frontend';
  authorized= "authorized";
  OnInit(){
this.authorized=sessionStorage.getItem("authorized")||"";
console.log('this.authorized', this.authorized)
  }
}
