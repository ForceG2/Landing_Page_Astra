import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';
import { Attractions } from './attractions/attractions';
import { Faq } from './faq/faq';
import { Hero } from './hero/hero';

@Component({
  selector: 'app-root',
  imports: [Background, About, Attractions, Faq, Hero],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
