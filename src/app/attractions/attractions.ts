import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

type Card = { image: string; caption: string };

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.css',
})
export class Attractions implements AfterViewInit {
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;
  
  originalCards: Card[] = [
    { image: '/assets/images/brandon-sanderson.jpg', caption: 'Entrevista com Brandon Sanderson' },
    { image: '/assets/images/bruninho.jpg',           caption: 'Show do Bruno Mars ao vivo' },
    { image: '/assets/images/interstellar-poster.jpg',caption: 'Sessão de Interestelar' },
    { image: '/assets/images/buffet.jpg',             caption: 'Buffet 24 horas' },
    { image: '/assets/images/camara-gravidade.png',   caption: 'Câmara sem gravidade' },
  ];
  
  cards: Card[] = [];
  private cardWidth = 340 + 32; // largura do card + gap
  
  ngAfterViewInit() {
    // cria cópias suficientes para preencher a tela e ter buffer
    this.cards = [
      ...this.originalCards,
      ...this.originalCards,
      ...this.originalCards,
      ...this.originalCards
    ];
    
    // inicia no segundo conjunto
    setTimeout(() => {
      this.track.nativeElement.scrollLeft = this.cardWidth * this.originalCards.length;
    }, 0);
  }
  
  scrollLeft() {
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
    const targetScroll = currentScroll - this.cardWidth;
    
    // se está muito no início, adiciona cards no começo
    if (currentScroll < this.cardWidth * this.originalCards.length) {
      this.prependCards();
      el.scrollLeft = currentScroll + (this.cardWidth * this.originalCards.length);
    }
    
    el.scrollBy({
      left: -this.cardWidth,
      behavior: 'smooth',
    });
  }
  
  scrollRight() {
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    
    // se está muito no final, adiciona cards no final
    if (currentScroll > maxScroll - (this.cardWidth * this.originalCards.length)) {
      this.appendCards();
    }
    
    el.scrollBy({
      left: this.cardWidth,
      behavior: 'smooth',
    });
  }
  
  private prependCards() {
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
    
    // adiciona cards no início
    this.cards = [...this.originalCards, ...this.cards];
    
    // ajusta a posição do scroll para compensar os novos cards
    setTimeout(() => {
      el.scrollLeft = currentScroll + (this.cardWidth * this.originalCards.length);
    }, 0);
  }
  
  private appendCards() {
    // adiciona cards no final
    this.cards = [...this.cards, ...this.originalCards];
  }
  
  private getScrollAmount(): number {
    return this.track.nativeElement.clientWidth;
  }
}