import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';
import { Attractions } from './attractions/attractions';
import { Faq } from './faq/faq';

@Component({
  selector: 'app-root',
  imports: [Background, About, Attractions, Faq],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
