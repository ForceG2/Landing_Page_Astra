import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

type Card = { image: string; caption: string };

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.css',
})
export class Attractions {
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  cards: Card[] = [
    { image: '/assets/images/brandon-sanderson.jpg', caption: 'Entrevista com Brandon Sanderson' },
    { image: '/assets/images/bruninho.jpg',           caption: 'Show do Bruno Mars ao vivo' },
    { image: '/assets/images/interstellar-poster.jpg',caption: 'Sessão de Interestelar' },
    { image: '/assets/images/buffet.jpg',             caption: 'Buffet 24 horas' },
    { image: '/assets/images/camara-gravidade.png',   caption: 'Câmara sem gravidade' },
  ];

  scrollLeft() {
    this.track.nativeElement.scrollBy({
      left: -this.getScrollAmount(),
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.track.nativeElement.scrollBy({
      left: this.getScrollAmount(),
      behavior: 'smooth',
    });
  }

  private getScrollAmount(): number {
    return this.track.nativeElement.clientWidth;
  }
}