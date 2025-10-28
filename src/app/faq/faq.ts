import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, HostListener } from '@angular/core';


@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq implements AfterViewInit {
  openIndex: number | null = null;
  isMobile = false;

  faqs = [
    {
      q: 'É seguro viajar para o espaço?',
      a: {
        long: 'Sim. A segurança é o pilar central da nossa missão. Nossas naves seguem protocolos internacionais de aviação e exploração espacial, passam por revisões constantes e contam com sistemas redundantes para qualquer eventualidade. Além disso, nossa tripulação é formada por especialistas com anos de experiência, preparados para garantir tranquilidade em cada momento da sua jornada.',
        short: 'Sim, a segurança é nossa prioridade máxima. Nossas naves seguem rigorosos protocolos internacionais e nossa tripulação é altamente experiente para garantir sua tranquilidade.'
      }
    },
    {
      q: 'Preciso de treinamento especial para participar?',
      a: {
        long: 'Você não precisa ser astronauta! Oferecemos um treinamento imersivo e acessível, pensado para qualquer pessoa. Em poucas horas você aprenderá desde os cuidados básicos de segurança até como se locomover em gravidade reduzida - de forma leve, divertida e prática, para que sua única preocupação seja aproveitar a experiência ao máximo.',
        short: 'Não é preciso ser astronauta. Oferecemos um treinamento rápido, divertido e acessível, focado na sua segurança e para que você aproveite a experiência ao máximo.'
      }
    },
    {
      q: 'Quanto tempo dura a viagem?',
      a: {
        long: 'A experiência completa dura cerca de 5 dias, incluindo preparação e treinamento. Já a estadia no espaço tem duração de aproximadamente 72 horas, mais que o suficiente para vivenciar a ausência de gravidade, admirar o nascer da Terra no horizonte e criar memórias que ficarão para sempre.',
        short: 'A experiência completa dura cerca de 5 dias, com aproximadamente 72 horas no espaço. Tempo suficiente para criar memórias inesquecíveis.'
      }
    },
    {
      q: 'Vou realmente ver a Terra do espaço?',
      a: {
        long: 'Com toda certeza! As janelas panorâmicas das nossas naves foram projetadas especialmente para proporcionar vistas de até 360°. Você verá o planeta azul em toda a sua magnitude, um espetáculo que só quem já esteve no espaço consegue descrever plenamente.',
        short: 'Sim! Nossas naves possuem janelas panorâmicas projetadas para vistas espetaculares de 360° do planeta azul.'
      }
    },
    {
      q: 'Qualquer pessoa pode participar?',
      a: {
        long: 'Nosso objetivo é tornar o espaço acessível. Há apenas alguns requisitos básicos: idade mínima de 12 anos e boas condições gerais de saúde. Realizamos uma avaliação médica simples para confirmar sua aptidão, sem burocracias.',
        short: 'Sim, nosso objetivo é tornar o espaço acessível. Os requisitos são ter no mínimo 12 anos e boas condições de saúde, confirmadas por uma avaliação simples.'
      }
    },
    {
      q: 'Onde acontece o lançamento da nave?',
      a: {
        long: 'O embarque acontece em nosso espaçoporto parceiro, especialmente preparado para oferecer conforto e segurança desde o primeiro momento. O transporte até lá já está incluído no pacote, para que sua jornada seja inesquecível do início ao fim.',
        short: 'O lançamento ocorre em nosso espaçoporto parceiro, com todo o conforto e segurança. O transporte até o local já está incluído no pacote.'
      }
    },
  ];

  @ViewChildren('answer') answers!: QueryList<ElementRef<HTMLDivElement>>;
  answerHeights: number[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth();
  }

  ngOnInit(): void {
    this.checkScreenWidth();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.calculateHeights());
    this.answers.changes.subscribe(() => {
      setTimeout(() => this.calculateHeights());
    });
  }

  checkScreenWidth(): void {
    this.isMobile = window.innerWidth <= 768; 
    if (this.openIndex !== null) {
      setTimeout(() => this.calculateHeights(), 60);
    }
  }

  calculateHeights(): void {
    this.answerHeights = this.answers.map(a => {
      return a.nativeElement.scrollHeight;
    });
  }

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
    if (this.openIndex !== null) {
      setTimeout(() => this.calculateHeights(), 60);
    }
  }
}