import { Component } from '@angular/core';
import { Background } from './background/background';

@Component({
  selector: 'app-root',
  imports: [Background],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
