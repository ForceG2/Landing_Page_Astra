import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

type BaseCard = { image: string; caption: string; details: string };
type CardVM = BaseCard & { id: number; flipped: boolean };

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.css',
})
export class Attractions implements AfterViewInit {
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  private originalCards: BaseCard[] = [
    {
      image: '/assets/images/brandon-sanderson.jpg',
      caption: 'Entrevista com Brandon Sanderson',
      details:
        'Bate-papo exclusivo sobre criação de mundos, escrita de fantasia e o Cosmere. Sessão de perguntas e respostas ao vivo.',
    },
    {
      image: '/assets/images/bruninho.jpg',
      caption: 'Show do Bruno Mars ao vivo',
      details:
        'Setlist especial com os maiores hits, salão ambientado e número inédito inspirado no espaço sideral.',
    },
    {
      image: '/assets/images/interstellar-poster.jpg',
      caption: 'Sessão de Interestelar',
      details:
        'Exibição em projeção estelar com áudio espacial. Debate pós-filme sobre ciência.',
    },
    {
      image: '/assets/images/buffet.jpg',
      caption: 'Buffet 24 horas',
      details:
        'Cozinha internacional com cardápio rotativo, opções veganas e estação de cafés. Aberto a qualquer hora.',
    },
    {
      image: '/assets/images/camara-gravidade.png',
      caption: 'Câmara sem gravidade',
      details:
        'Experiência controlada de gravidade zero com monitoramento. Orientações de segurança inclusas na atividade.',
    },
  ];

  cards: CardVM[] = [];
  private cardWidth = 372;
  private isAdjusting = false;
  private nextId = 1;
  private currentlyFlippedId: number | null = null;

  ngAfterViewInit() {
    const repeated: CardVM[] = [];
    const times = 5;

    for (let t = 0; t < times; t++) {
      for (const base of this.originalCards) {
        repeated.push({
           id: this.nextId++, 
           image: base.image, 
           caption: base.caption, 
           details: base.details, 
           flipped: false,
          });
      }
    }
    this.cards = repeated;

    setTimeout(() => {
      this.updateCardWidth();
      this.track.nativeElement.scrollLeft = this.cardWidth * this.originalCards.length * 2;
    }, 0);
  }

  trackById(_index: number, item: CardVM) { 
    return item.id;
   }

  @HostListener('window:resize')
  onResize() { 
    this.updateCardWidth();
   }

  private updateCardWidth() {
    const cards = this.track.nativeElement.querySelectorAll<HTMLElement>('.card');
    if (cards.length > 0) {
      const card = cards[0];
      const style = window.getComputedStyle(this.track.nativeElement);
      const gap = parseInt(style.gap) || 32;
      this.cardWidth = card.offsetWidth + gap;
    }
  }

  onCardKeydown(ev: KeyboardEvent, card: CardVM) {
    const key = ev.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      ev.preventDefault();
      this.toggleFlip(card);
    }
  }

  // Clicar na carta vira/desvira
  toggleFlip(card: CardVM) {
    if (card.flipped) {
      // clicou no mesmo virado -> desvirar
      card.flipped = false;
      this.currentlyFlippedId = null;
      return;
    }

    // desvirar todos antes de virar o atual
    if (this.currentlyFlippedId !== null) {
      const prev = this.cards.find(c => c.id === this.currentlyFlippedId);
      if (prev) prev.flipped = false;
    }
    card.flipped = true;
    this.currentlyFlippedId = card.id;
  }

  scrollLeft() {
    if (this.isAdjusting) return;
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;

    if (currentScroll < this.cardWidth * this.originalCards.length * 1.5) {
      this.prependCards();
      return;
    }

    el.scrollBy({ left: -this.cardWidth, behavior: 'smooth' });
  }

  scrollRight() {
    if (this.isAdjusting) return;
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (currentScroll > maxScroll - this.cardWidth * this.originalCards.length * 1.5) {
      this.appendCards();
      return;
    }

    el.scrollBy({ left: this.cardWidth, behavior: 'smooth' });
  }

  private prependCards() {
    this.isAdjusting = true;
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;

    el.style.scrollBehavior = 'auto';

    const block: CardVM[] = this.originalCards.map((b) => ({
      id: this.nextId++, 
      image: b.image, 
      caption: b.caption, 
      details: b.details, 
      flipped: false,
    }));
    this.cards = [...block, ...this.cards];

    setTimeout(() => {
      el.scrollLeft = currentScroll + this.cardWidth * this.originalCards.length;
      setTimeout(() => {
        el.style.scrollBehavior = 'smooth';
        this.isAdjusting = false;
        el.scrollBy({ left: -this.cardWidth, behavior: 'smooth' });
      }, 50);
    }, 0);
  }

  private appendCards() {
    this.isAdjusting = true;

    const block: CardVM[] = this.originalCards.map((b) => ({
      id: this.nextId++, 
      image: b.image, 
      caption: b.caption, 
      details: b.details, 
      flipped: false,
    }));
    this.cards = [...this.cards, ...block];

    setTimeout(() => {
      this.isAdjusting = false;
      this.track.nativeElement.scrollBy({ left: this.cardWidth, behavior: 'smooth' });
    }, 50);
  }

  private getScrollAmount(): number { 
    return this.track.nativeElement.clientWidth; 
  }
}
