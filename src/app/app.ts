import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';
import { Attractions } from './attractions/attractions';

@Component({
  selector: 'app-root',
  imports: [Background, About, Attractions],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
