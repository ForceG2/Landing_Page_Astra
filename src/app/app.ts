import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';
import { Attractions } from './attractions/attractions';
import { Faq } from './faq/faq';
import { Hero } from './hero/hero';
import { Footer } from './footer/footer';
import { Trajectory } from './trajectory/trajectory';
import { Testimonials } from './testimony/testimony';

@Component({
  selector: 'app-root',
  imports: [Background, Hero, About, Attractions, Faq, Footer, Trajectory, Testimonials],
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [Background, Header, Hero, About, Attractions, Faq, Footer, Trajectory],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}