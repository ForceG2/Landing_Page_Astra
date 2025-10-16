import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';

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

  private readonly INITIAL_REPEAT_FACTOR = 5;
  private readonly SCROLL_THRESHOLD_FACTOR = 1.5;

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
  private cardWidth = 0;
  private nextId = 1;
  private isTeleporting = false;
  private currentIndex = 0;

  ngOnInit(): void {
    const repeatedTestimonials: TestimonialVM[] = [];
    for (let i = 0; i < this.INITIAL_REPEAT_FACTOR; i++) {
      repeatedTestimonials.push(...this.createTestimonialBlock());
    }
    this.testimonials = repeatedTestimonials;
    this.currentIndex = Math.floor(this.testimonials.length / 2);
  }

  ngAfterViewInit(): void {
    this.updateCardWidth();
    requestAnimationFrame(() => {
      this.scrollToIndex(this.currentIndex);
    });
  }

  trackById(_index: number, item: TestimonialVM): number {
    return item.id;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardWidth();
    this.scrollToIndex(this.currentIndex);
  }

  navigatePrev(): void {
    this.currentIndex--;
    this.scrollToCurrentIndex();
    this.ensureLoop();
  }

  navigateNext(): void {
    this.currentIndex++;
    this.scrollToCurrentIndex();
    this.ensureLoop();
  }

  private scrollToCurrentIndex(): void {
    const el = this.track.nativeElement;
    el.style.scrollBehavior = 'smooth';
    this.scrollToIndex(this.currentIndex);
  }

  private scrollToIndex(index: number): void {
    const el = this.track.nativeElement;
    const targetScroll = index * this.cardWidth;
    el.scrollLeft = targetScroll;
  }

  private ensureLoop(): void {
    if (this.isTeleporting) return;

    setTimeout(() => {
      const threshold = this.getScrollThreshold();
      const totalCards = this.testimonials.length;
      const blockSize = this.originalTestimonials.length;

      if (this.currentIndex < threshold / this.cardWidth) {
        this.teleportToEquivalent(blockSize);
      } else if (this.currentIndex > totalCards - (threshold / this.cardWidth)) {
        this.teleportToEquivalent(-blockSize);
      }
    }, 500);
  }

  private teleportToEquivalent(offset: number): void {
    this.isTeleporting = true;
    const el = this.track.nativeElement;
    
    this.currentIndex += offset;
    
    el.style.scrollBehavior = 'auto';
    this.scrollToIndex(this.currentIndex);
    el.style.scrollBehavior = 'smooth';
    
    this.isTeleporting = false;
  }

  private createTestimonialBlock(): TestimonialVM[] {
    return this.originalTestimonials.map(baseTestimonial => ({
      ...baseTestimonial,
      id: this.nextId++,
    }));
  }

  private updateCardWidth(): void {
    const cardEl = this.track.nativeElement.querySelector<HTMLElement>('.testimonial-card');
    if (cardEl) {
      const style = window.getComputedStyle(this.track.nativeElement);
      const gap = parseInt(style.gap) || 0;
      this.cardWidth = cardEl.offsetWidth + gap;
    }
  }

  private getScrollThreshold(): number {
    return this.getOriginalBlockWidth() * this.SCROLL_THRESHOLD_FACTOR;
  }

  private getOriginalBlockWidth(): number {
    return this.cardWidth * this.originalTestimonials.length;
  }
}