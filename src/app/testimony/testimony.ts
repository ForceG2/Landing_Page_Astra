import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnInit,
  OnDestroy
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
export class Testimonials implements OnInit, AfterViewInit, OnDestroy {
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
    {
      quote: 'Achei que fosse sentir medo, mas foi o oposto. A serenidade do espaço e o silêncio absoluto me fizeram repensar a vida. Tudo lá em cima é pura harmonia.',
      author: 'Patrícia Mendes',
      role: 'Professora de Física',
    },
    {
      quote: 'Foi tudo extremamente bem organizado. As palestras sobre astronomia durante a viagem tornaram tudo ainda mais fascinante. Um verdadeiro turismo educativo.',
      author: 'Eduardo Pereira',
      role: 'Astrônomo Amador',
    },
    {
      quote: 'A viagem foi perfeita do início ao fim. A gastronomia, o entretenimento e o conforto superaram qualquer resort de luxo na Terra. Simplesmente espetacular.',
      author: 'Bruna Carvalho',
      role: 'Chefe de Cozinha',
    }
   ];

  testimonials: TestimonialVM[] = [];
  private nextId = 1;
  private cardWidth = 0;
  private currentIndex = 0;
  private readonly originalLength: number;
  private boundOnScroll = this.onScroll.bind(this);
  private rafHandle: number | null = null;
  private isTransitioning = false;
  private scrollTimeout: any = null;

  constructor() {
    this.originalLength = this.originalTestimonials.length;
  }

  ngOnInit(): void {
    const tripled = [
      ...this.originalTestimonials,
      ...this.originalTestimonials,
      ...this.originalTestimonials
    ];
    this.testimonials = tripled.map(t => ({ ...t, id: this.nextId++ }));
    this.currentIndex = this.originalLength;
  }

  ngAfterViewInit(): void {
    this.updateCardWidth();
    requestAnimationFrame(() => this.scrollToIndex(this.currentIndex, false));

    this.track.nativeElement.addEventListener('scroll', this.boundOnScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.track?.nativeElement?.removeEventListener('scroll', this.boundOnScroll);
    if (this.rafHandle != null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
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
    return true; 
  }

  get canNext(): boolean {
    return true; 
  }

  navigatePrev(): void {
    if (this.isTransitioning) return;
    
    this.currentIndex--;
    
    if (this.currentIndex < 0) {
      this.currentIndex = this.originalLength * 2 - 1;
    }
    
    this.scrollToIndex(this.currentIndex, true);
  }

  navigateNext(): void {
    if (this.isTransitioning) return;
    
    this.currentIndex++;
    
    if (this.currentIndex >= this.originalLength * 3) {
      this.currentIndex = this.originalLength;
    }
    
    this.scrollToIndex(this.currentIndex, true);
  }

  private scrollToIndex(index: number, smooth = true): void {
    const trackEl = this.track.nativeElement;
    
    const safeIndex = Math.max(0, Math.min(index, this.testimonials.length - 1));
    const scrollLeft = safeIndex * this.cardWidth;

    if (smooth) {
      this.isTransitioning = true;
    }

    trackEl.style.scrollBehavior = smooth ? 'smooth' : 'auto';
    trackEl.scrollLeft = scrollLeft;

    if (smooth) {
      setTimeout(() => {
        trackEl.style.scrollBehavior = 'auto';
        this.isTransitioning = false;
        this.checkAndReposition();
      }, 300);
    } else {
      this.isTransitioning = false;
    }
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

  private onScroll(): void {
    if (this.rafHandle != null) return;
    
    this.rafHandle = requestAnimationFrame(() => {
      this.rafHandle = null;
      const trackEl = this.track.nativeElement;

      if (!this.cardWidth) return;

      const rawIndex = trackEl.scrollLeft / this.cardWidth;
      let newIndex = Math.round(rawIndex);
      
      newIndex = Math.max(0, Math.min(newIndex, this.testimonials.length - 1));

      this.currentIndex = newIndex;

      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(() => {
        if (!this.isTransitioning) {
          this.checkAndReposition();
        }
      }, 150);
    });
  }

  private checkAndReposition(): void {
    if (this.isTransitioning) return;

    if (this.currentIndex >= this.originalLength * 2) {
      this.currentIndex = this.currentIndex - this.originalLength;
      this.scrollToIndex(this.currentIndex, false);
    } 

    else if (this.currentIndex < this.originalLength) {
      this.currentIndex = this.currentIndex + this.originalLength;
      this.scrollToIndex(this.currentIndex, false);
    }
  }
}