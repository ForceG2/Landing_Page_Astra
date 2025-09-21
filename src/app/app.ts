import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';

@Component({
  selector: 'app-root',
  imports: [Background, About],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
