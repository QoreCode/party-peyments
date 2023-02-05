import { Component, OnInit } from '@angular/core';
import test from '../business/business.test';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'party-payments.app';

  ngOnInit(): void {
    test();
  }
}
