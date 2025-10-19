import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnInit
} from '@angular/core';

type BaseTestimonial = { quote: string; author: string; role: string };
type TestimonialVM = BaseTestimonial & { id: number };

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimony.html',
  styleUrl: './testimony.css',
})
export class Testimonials implements OnInit, AfterViewInit {
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;
  @ViewChild('trackContainer', { static: true }) trackContainer!: ElementRef<HTMLDivElement>;

  private readonly originalTestimonials: BaseTestimonial[] = [
    {
      quote: 'Sempre sonhei em ver a Terra do espaço, mas o cruzeiro superou qualquer expectativa. As cabines eram super confortáveis, a comida incrível e, à noite, observar as estrelas pela janela parecia coisa de filme. Voltarei com certeza!',
      author: 'Ana Beatriz',
      role: 'Engenheira Aeroespacial',
    },
    {
      quote: 'A experiência foi literalmente de outro mundo! Cada detalhe foi pensado para proporcionar conforto e magia. Ver a Terra do espaço enquanto aproveitava shows ao vivo e gastronomia de primeira foi inesquecível.',
      author: 'Carlos Eduardo',
      role: 'Arquiteto',
    },
    {
      quote: 'Nunca imaginei que seria possível viajar ao espaço com tanto conforto e segurança. A tripulação foi excepcional e as atividades a bordo surpreenderam a cada momento. Uma experiência que mudou minha perspectiva de vida.',
      author: 'Marina Santos',
      role: 'Médica',
    },
    {
      quote: 'O cruzeiro espacial superou todas as minhas expectativas! Desde o atendimento impecável até as vistas espetaculares do cosmos. A câmara de gravidade zero foi o ponto alto da viagem. Recomendo a todos que buscam uma aventura única.',
      author: 'Rafael Costa',
      role: 'Empresário',
    },
  ];

  testimonials: TestimonialVM[] = [];
  private nextId = 1;
  private cardWidth = 0;
  private currentIndex = 0;

  ngOnInit(): void {
    // NÃO repetimos mais — apenas os originais
    this.testimonials = this.originalTestimonials.map(t => ({ ...t, id: this.nextId++ }));
    this.currentIndex = 0;
  }

  ngAfterViewInit(): void {
    this.updateCardWidth();
    requestAnimationFrame(() => this.scrollToIndex(this.currentIndex, false));
  }

  trackById(_index: number, item: TestimonialVM): number {
    return item.id;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardWidth();
    this.scrollToIndex(this.currentIndex, false);
  }

  get canPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canNext(): boolean {
    return this.currentIndex < this.testimonials.length - 1;
  }

  navigatePrev(): void {
    if (!this.canPrev) return;
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.scrollToIndex(this.currentIndex, true);
  }

  navigateNext(): void {
    if (!this.canNext) return;
    this.currentIndex = Math.min(this.testimonials.length - 1, this.currentIndex + 1);
    this.scrollToIndex(this.currentIndex, true);
  }

  private scrollToIndex(index: number, smooth = true): void {
    const trackEl = this.track.nativeElement;
    const containerEl = this.trackContainer.nativeElement;
    const scrollLeft = index * this.cardWidth;
    if (smooth) {
      trackEl.style.scrollBehavior = 'smooth';
    } else {
      trackEl.style.scrollBehavior = 'auto';
    }
    trackEl.scrollLeft = scrollLeft;
  }

  private updateCardWidth(): void {
    const containerEl = this.trackContainer.nativeElement;
    this.cardWidth = containerEl.clientWidth || containerEl.getBoundingClientRect().width || 0;
    const cards = Array.from(this.track.nativeElement.querySelectorAll<HTMLElement>('.testimonial-card'));
    cards.forEach(card => {
      card.style.minWidth = `${this.cardWidth}px`;
      card.style.maxWidth = `${this.cardWidth}px`;
      card.style.width = `${this.cardWidth}px`;
    });
  }
}
