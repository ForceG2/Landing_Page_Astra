import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';
import { Attractions } from './attractions/attractions';
import { Faq } from './faq/faq';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [Background, About, Attractions, Faq, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
