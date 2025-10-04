import { Component } from '@angular/core';
import { Background } from './background/background';
import { About } from './about/about';
import { Attractions } from './attractions/attractions';
import { Faq } from './faq/faq';
import { Forms } from './forms/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Background, About, Attractions, Faq, Forms],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
