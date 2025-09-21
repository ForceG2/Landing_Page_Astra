import { Component } from '@angular/core';
import { Background } from './background/background';
import { Trajectory } from './trajectory/trajectory';

@Component({
  selector: 'app-root',
  imports: [Background, Trajectory],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}