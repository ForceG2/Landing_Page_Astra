import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

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
  private cardWidth = 372; // valor inicial
  private isAdjusting = false;
 
  ngAfterViewInit() {
    // cria cópias suficientes para ter buffer nos dois lados
    this.cards = [
      ...this.originalCards,
      ...this.originalCards,
      ...this.originalCards,
      ...this.originalCards,
      ...this.originalCards
    ];
   
    // unicia no meio (terceiro conjunto)
    setTimeout(() => {
      this.updateCardWidth();
      this.track.nativeElement.scrollLeft = this.cardWidth * this.originalCards.length * 2;
    }, 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCardWidth();
  }

  private updateCardWidth() {
    const cards = this.track.nativeElement.querySelectorAll('.card');
    if (cards.length > 0) {
      const card = cards[0] as HTMLElement;
      const style = window.getComputedStyle(this.track.nativeElement);
      const gap = parseInt(style.gap) || 32;
      this.cardWidth = card.offsetWidth + gap;
    }
  }
 
  scrollLeft() {
    if (this.isAdjusting) return;
   
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
   
    // se está muito no início, adiciona cards no começo
    if (currentScroll < this.cardWidth * this.originalCards.length * 1.5) {
      this.prependCards();
      return;
    }
   
    el.scrollBy({
      left: -this.cardWidth,
      behavior: 'smooth',
    });
  }
 
  scrollRight() {
    if (this.isAdjusting) return;
   
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
   
    // se está muito no final, adiciona cards no final
    if (currentScroll > maxScroll - (this.cardWidth * this.originalCards.length * 1.5)) {
      this.appendCards();
      return;
    }
   
    el.scrollBy({
      left: this.cardWidth,
      behavior: 'smooth',
    });
  }
 
  private prependCards() {
    this.isAdjusting = true;
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
   
    // desabilita scroll suave temporariamente
    el.style.scrollBehavior = 'auto';

    // adiciona cards no início
    this.cards = [...this.originalCards, ...this.cards];
   
    // ajusta a posição do scroll instantaneamente
    setTimeout(() => {
      el.scrollLeft = currentScroll + (this.cardWidth * this.originalCards.length);
     
      // reabilita scroll suave
      setTimeout(() => {
        el.style.scrollBehavior = 'smooth';
        this.isAdjusting = false;
       
        // scroll para a esquerda
        el.scrollBy({
          left: -this.cardWidth,
          behavior: 'smooth',
        });
      }, 50);
    }, 0);
  }
 
  private appendCards() {
    this.isAdjusting = true;

    // adiciona cards no final
    this.cards = [...this.cards, ...this.originalCards];
   
    // aguarda o DOM atualizar e então faz o scroll
    setTimeout(() => {
      this.isAdjusting = false;
      this.track.nativeElement.scrollBy({
        left: this.cardWidth,
        behavior: 'smooth',
      });
    }, 50);
  }
 
  private getScrollAmount(): number {
    return this.track.nativeElement.clientWidth;
  }
}