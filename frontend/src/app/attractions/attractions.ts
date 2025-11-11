import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnInit, OnDestroy } from '@angular/core';

type BaseCard = { image: string; caption: string; details: string };
type CardVM = BaseCard & { id: number; flipped: boolean; animating: boolean };

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attractions.html',
  styleUrl: './attractions.css',
})
export class Attractions implements OnInit, AfterViewInit, OnDestroy {
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

  cards: CardVM[] = [];
  private cardWidth = 372;
  private nextId = 1;
  private currentlyFlippedCardId: number | null = null;
  private autoScrollRafId: number | null = null;
  private autoScrollDirection: 'left' | 'right' | null = null;
  private lastFrameTimestamp = 0;
  private pointerDownTime = 0;
  private isTeleporting = false;
  private boundOnScroll = this.onTrackScroll.bind(this);

  ngOnInit(): void {
    const repeatedCards: CardVM[] = [];
    for (let i = 0; i < this.INITIAL_REPEAT_FACTOR; i++) {
      repeatedCards.push(...this.createCardBlock());
    }
    this.cards = repeatedCards;
  }

  ngAfterViewInit(): void {
    this.updateCardWidth();
    requestAnimationFrame(() => {
      const el = this.track.nativeElement;
      el.scrollLeft = this.getScrollThreshold();
    });
    
    this.track.nativeElement.addEventListener('scroll', this.boundOnScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.track?.nativeElement?.removeEventListener('scroll', this.boundOnScroll);
    if (this.holdTimerId) {
      clearTimeout(this.holdTimerId);
    }
    if (this.autoScrollRafId) {
      cancelAnimationFrame(this.autoScrollRafId);
    }
  }

  trackById(_index: number, item: CardVM): number {
    return item.id;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardWidth();
  }

  onCardKeydown(event: KeyboardEvent, card: CardVM): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleFlip(card);
    }
  }

  toggleFlip(cardToToggle: CardVM): void {

    if (cardToToggle.animating) return;

    if (this.currentlyFlippedCardId && this.currentlyFlippedCardId !== cardToToggle.id) {
      const prev = this.cards.find(c => c.id === this.currentlyFlippedCardId);
      if (prev) this.setCardFlipState(prev, false);
    }

    this.setCardFlipState(cardToToggle, !cardToToggle.flipped);
    this.currentlyFlippedCardId = cardToToggle.flipped ? cardToToggle.id : null;
  }

  private setCardFlipState(card: CardVM, flipped: boolean): void {
    card.flipped = flipped;
    card.animating = true;
    setTimeout(() => (card.animating = false), this.FLIP_ANIMATION_DURATION);
  }

  onTrackScroll(): void {
    if (!this.isTeleporting) {
      this.ensureLoop(this.track.nativeElement);
    }
  }

  startAutoScroll(direction: 'left' | 'right'): void {
    this.pointerDownTime = Date.now();
    this.autoScrollDirection = direction;
    this.lastFrameTimestamp = 0;

    if (this.autoScrollRafId) cancelAnimationFrame(this.autoScrollRafId);
    if (this.holdTimerId) { clearTimeout(this.holdTimerId); this.holdTimerId = null; }

    this.holdTimerId = window.setTimeout(() => {
      this.holdTimerId = null;
      this.track.nativeElement.style.scrollBehavior = 'auto';
      this.autoScrollRafId = requestAnimationFrame(this.autoScrollStep);
    }, this.HOLD_ACTIVATION_DELAY);
  }

  stopAutoScroll(): void {
    const holdDuration = Date.now() - this.pointerDownTime;
    const wasQuickClick = holdDuration < this.HOLD_ACTIVATION_DELAY;

    if (this.holdTimerId) { clearTimeout(this.holdTimerId); this.holdTimerId = null; }
    if (this.autoScrollRafId) { cancelAnimationFrame(this.autoScrollRafId); this.autoScrollRafId = null; }

    const el = this.track.nativeElement;

    if (wasQuickClick && this.autoScrollDirection) {
      const direction = this.autoScrollDirection === 'left' ? -1 : 1;
      el.style.scrollBehavior = 'smooth';
      this.scrollByAmount(direction * this.cardWidth * this.CARDS_TO_SCROLL, true);
    } else {
      el.style.scrollBehavior = 'smooth';
    }

    this.autoScrollDirection = null;
  }

  private autoScrollStep = (timestamp: number): void => {
    if (!this.autoScrollDirection) return;

    if (!this.lastFrameTimestamp) this.lastFrameTimestamp = timestamp;
    const deltaTime = Math.min((timestamp - this.lastFrameTimestamp) / 1000, 0.05);
    this.lastFrameTimestamp = timestamp;

    const scrollAmount = this.HOLD_SCROLL_SPEED * deltaTime;
    const dir = this.autoScrollDirection === 'left' ? -1 : 1;

    this.scrollByAmountDirect(scrollAmount * dir);
    this.ensureLoop(this.track.nativeElement);

    this.autoScrollRafId = requestAnimationFrame(this.autoScrollStep);
  };

  private scrollByAmount(amount: number, smooth = true): void {
    const el = this.track.nativeElement;
    el.scrollBy({ left: amount, behavior: smooth ? 'smooth' : 'auto' });
    requestAnimationFrame(() => this.ensureLoop(el));
  }

  private scrollByAmountDirect(amount: number): void {
    const el = this.track.nativeElement;
    el.scrollBy({ left: amount, behavior: 'auto' });
    this.ensureLoop(el);
  }

  private ensureLoop(el: HTMLElement): void {
    if (this.isTeleporting) return;

    const threshold = this.getScrollThreshold();
    const block = this.getOriginalBlockWidth();
    const max = el.scrollWidth - el.clientWidth;

    if (el.scrollLeft < threshold) {
      this.teleport(el, +block);
    } else if (el.scrollLeft > max - threshold) {
      this.teleport(el, -block);
    }
  }

  private teleport(el: HTMLElement, delta: number): void {
    this.isTeleporting = true;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft += delta;
    el.style.scrollBehavior = prev || '';
  
    setTimeout(() => {
      this.isTeleporting = false;
    }, 0);
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