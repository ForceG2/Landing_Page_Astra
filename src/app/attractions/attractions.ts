import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';

type BaseCard = { image: string; caption: string; details: string };
type CardVM = BaseCard & { id: number; flipped: boolean; animating: boolean };

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.css',
})
export class Attractions implements OnInit, AfterViewInit {
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  private readonly FLIP_ANIMATION_DURATION = 700;
  private readonly INITIAL_REPEAT_FACTOR = 5;
  private readonly SCROLL_THRESHOLD_FACTOR = 1.5;
  private readonly HOLD_SCROLL_SPEED = 700;
  private readonly CARDS_TO_SCROLL = 3;
  private readonly HOLD_ACTIVATION_DELAY = 180; 
  private holdTimerId: number | null = null;

  private readonly originalCards: BaseCard[] = [
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

  // estado do componente
  cards: CardVM[] = [];
  private cardWidth = 372;
  private isAdjustingTrack = false;
  private nextId = 1;
  private currentlyFlippedCardId: number | null = null;
  private autoScrollRafId: number | null = null;
  private autoScrollDirection: 'left' | 'right' | null = null;
  private lastFrameTimestamp = 0;
  private pointerDownTime = 0;

  ngOnInit(): void {
    const repeatedCards: CardVM[] = [];
    for (let i = 0; i < this.INITIAL_REPEAT_FACTOR; i++) {
      repeatedCards.push(...this.createCardBlock());
    }
    this.cards = repeatedCards;
  }

  ngAfterViewInit(): void {
    this.updateCardWidth();
    // posiciona o scroll no meio para dar a ilusão de infinito em ambas as direções
    requestAnimationFrame(() => {
      const el = this.track.nativeElement;
      el.scrollLeft = this.getScrollThreshold();
    });
  }

  trackById(_index: number, item: CardVM): number {
    return item.id;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardWidth();
  }

  // lógica de Interação com cards 
  onCardKeydown(event: KeyboardEvent, card: CardVM): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleFlip(card);
    }
  }

  toggleFlip(cardToToggle: CardVM): void {
    // se o card já estiver em animação, não faz nada
    if (cardToToggle.animating) return;

    // desvira o card que estava virado anteriormente (se houver um e não for o mesmo)
    if (this.currentlyFlippedCardId && this.currentlyFlippedCardId !== cardToToggle.id) {
      const previouslyFlippedCard = this.cards.find(c => c.id === this.currentlyFlippedCardId);
      if (previouslyFlippedCard) {
        this.setCardFlipState(previouslyFlippedCard, false);
      }
    }

    // vira ou desvira o card atual
    this.setCardFlipState(cardToToggle, !cardToToggle.flipped);
    this.currentlyFlippedCardId = cardToToggle.flipped ? cardToToggle.id : null;
  }

  private setCardFlipState(card: CardVM, flipped: boolean): void {
    card.flipped = flipped;
    card.animating = true;
    setTimeout(() => (card.animating = false), this.FLIP_ANIMATION_DURATION);
  }

  // lógica de scroll - (clique rápido = 3 cards, hold = contínuo)
  startAutoScroll(direction: 'left' | 'right'): void {
  if (this.isAdjustingTrack) return;

  this.pointerDownTime = Date.now();
  this.autoScrollDirection = direction;
  this.lastFrameTimestamp = 0;

  // cancela qualquer rAF/timer pendente
  if (this.autoScrollRafId) cancelAnimationFrame(this.autoScrollRafId);
  if (this.holdTimerId) { clearTimeout(this.holdTimerId); this.holdTimerId = null; }

  // evita o "mini movimento" inicial
  this.holdTimerId = window.setTimeout(() => {
    this.holdTimerId = null;
    this.track.nativeElement.style.scrollBehavior = 'auto';
    this.autoScrollRafId = requestAnimationFrame(this.autoScrollStep);
  }, this.HOLD_ACTIVATION_DELAY);
}

stopAutoScroll(): void {
  const holdDuration = Date.now() - this.pointerDownTime;
  const wasQuickClick = holdDuration < this.HOLD_ACTIVATION_DELAY;

  // cancela rAF/timer se existirem
  if (this.holdTimerId) { clearTimeout(this.holdTimerId); this.holdTimerId = null; }
  if (this.autoScrollRafId) { cancelAnimationFrame(this.autoScrollRafId); this.autoScrollRafId = null; }

  // se foi um clique rápido, faz o scroll de 3 cards
  if (wasQuickClick && this.autoScrollDirection) {
    const direction = this.autoScrollDirection === 'left' ? -1 : 1;
    // suave
    this.track.nativeElement.style.scrollBehavior = 'smooth';
    this.scrollByAmount(direction * this.cardWidth * this.CARDS_TO_SCROLL, true);
  } else {
    // se estava em hold, volta o comportamento padrão suave
    this.track.nativeElement.style.scrollBehavior = 'smooth';
  }

  this.autoScrollDirection = null;
}

private autoScrollStep = (timestamp: number): void => {
  if (!this.autoScrollDirection) return;

  if (!this.lastFrameTimestamp) this.lastFrameTimestamp = timestamp;
  const deltaTime = Math.min((timestamp - this.lastFrameTimestamp) / 1000, 0.05);
  this.lastFrameTimestamp = timestamp;

  const scrollAmount = this.HOLD_SCROLL_SPEED * deltaTime;
  const directionMultiplier = this.autoScrollDirection === 'left' ? -1 : 1;

  this.scrollByAmountDirect(scrollAmount * directionMultiplier);

  this.autoScrollRafId = requestAnimationFrame(this.autoScrollStep);
};
  
  // lógica carrossel infinito
  private scrollByAmount(amount: number, smooth = true): void {
    if (this.isAdjustingTrack) return;
    
    if (amount > 0 && this.isNearEnd()) {
      this.appendCards();
    } else if (amount < 0 && this.isNearStart()) {
      this.prependCards();
    } else {
      this.track.nativeElement.scrollBy({ left: amount, behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  private scrollByAmountDirect(amount: number): void {
    if (this.isAdjustingTrack) return;
    
    const el = this.track.nativeElement;
    
    if (amount > 0 && this.isNearEnd()) {
      this.appendCards();
      el.scrollBy({ left: amount, behavior: 'auto' });
    } else if (amount < 0 && this.isNearStart()) {
      const currentScroll = el.scrollLeft;
      this.prependCards();
      requestAnimationFrame(() => {
        el.scrollLeft = currentScroll + this.getOriginalBlockWidth() + amount;
      });
    } else {
      el.scrollBy({ left: amount, behavior: 'auto' });
    }
  }

  private prependCards(): void {
    if (this.isAdjustingTrack) return;
    this.isAdjustingTrack = true;
    
    const el = this.track.nativeElement;
    const currentScroll = el.scrollLeft;
    
    // adiciona novos cards no início do array
    this.cards = [...this.createCardBlock(), ...this.cards];

    // espera o DOM atualizar e ajusta a posição do scroll p que não se perceba a adição de novos elementos
    requestAnimationFrame(() => {
      el.scrollLeft = currentScroll + this.getOriginalBlockWidth();
      this.isAdjustingTrack = false;
    });
  }

  private appendCards(): void {
    if (this.isAdjustingTrack) return;
    this.isAdjustingTrack = true;

    // adiciona novos cards no fim do array
    this.cards = [...this.cards, ...this.createCardBlock()];
    
    // apenas adiciona, não precisa ajustar o scroll
    // o próximo `scrollBy` continuará de onde parou
    requestAnimationFrame(() => {
        this.isAdjustingTrack = false;
    });
  }

  private createCardBlock(): CardVM[] {
    return this.originalCards.map(baseCard => ({
      ...baseCard,
      id: this.nextId++,
      flipped: false,
      animating: false,
    }));
  }

  private updateCardWidth(): void {
    const cardEl = this.track.nativeElement.querySelector<HTMLElement>('.card');
    if (cardEl) {
      const style = window.getComputedStyle(this.track.nativeElement);
      const gap = parseInt(style.gap) || 32;
      this.cardWidth = cardEl.offsetWidth + gap;
    }
  }
  
  private getScrollThreshold(): number {
    return this.getOriginalBlockWidth() * this.SCROLL_THRESHOLD_FACTOR;
  }
  
  private getOriginalBlockWidth(): number {
      return this.cardWidth * this.originalCards.length;
  }

  private isNearStart(): boolean {
    return this.track.nativeElement.scrollLeft < this.getScrollThreshold();
  }

  private isNearEnd(): boolean {
    const el = this.track.nativeElement;
    const maxScroll = el.scrollWidth - el.clientWidth;
    return el.scrollLeft > maxScroll - this.getScrollThreshold();
  }
}