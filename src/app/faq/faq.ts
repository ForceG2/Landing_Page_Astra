import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq implements AfterViewInit {
  openIndex: number | null = null;

  faqs = [
  {
    q: 'É seguro viajar para o espaço?',
    a: 'Sim. A segurança é o pilar central da nossa missão. Nossas naves seguem protocolos internacionais de aviação e exploração espacial, passam por revisões constantes e contam com sistemas redundantes para qualquer eventualidade. Além disso, nossa tripulação é formada por especialistas com anos de experiência, preparados para garantir tranquilidade em cada momento da sua jornada.'
  },
  {
    q: 'Preciso de treinamento especial para participar?',
    a: 'Você não precisa ser astronauta! Oferecemos um treinamento imersivo e acessível, pensado para qualquer pessoa. Em poucas horas você aprenderá desde os cuidados básicos de segurança até como se locomover em gravidade reduzida - de forma leve, divertida e prática, para que sua única preocupação seja aproveitar a experiência ao máximo.'
  },
  {
    q: 'Quanto tempo dura a viagem?',
    a: 'A experiência completa dura cerca de 5 dias, incluindo preparação e treinamento. Já a estadia no espaço tem duração de aproximadamente 72 horas, mais que o suficiente para vivenciar a ausência de gravidade, admirar o nascer da Terra no horizonte e criar memórias que ficarão para sempre.'
  },
  {
    q: 'Vou realmente ver a Terra do espaço?',
    a: 'Com toda certeza! As janelas panorâmicas das nossas naves foram projetadas especialmente para proporcionar vistas de até 360°. Você verá o planeta azul em toda a sua magnitude, um espetáculo que só quem já esteve no espaço consegue descrever plenamente.'
  },
  {
    q: 'Qualquer pessoa pode participar?',
    a: 'Nosso objetivo é tornar o espaço acessível. Há apenas alguns requisitos básicos: idade mínima de 12 anos e boas condições gerais de saúde. Realizamos uma avaliação médica simples para confirmar sua aptidão, sem burocracias.'
  },
  {
    q: 'Onde acontece o lançamento da nave?',
    a: 'O embarque acontece em nosso espaçoporto parceiro, especialmente preparado para oferecer conforto e segurança desde o primeiro momento. O transporte até lá já está incluído no pacote, para que sua jornada seja inesquecível do início ao fim.'
  },
];

  @ViewChildren('answer') answers!: QueryList<ElementRef<HTMLDivElement>>;
  answerHeights: number[] = [];

  ngAfterViewInit(): void {
    // calcula alturas iniciais
    this.calculateHeights();

    // recalcula se o QueryList mudar
    this.answers.changes.subscribe(() => {
      // timeout para garantir render
      setTimeout(() => this.calculateHeights());
    });
  }

  calculateHeights(): void {
    this.answerHeights = this.answers.map(a => {
      // retorna scrollHeight para cada div de resposta
      return a.nativeElement.scrollHeight;
    });
  }

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;

    // se a altura de algum conteúdo pode mudar, recalcule logo após abrir
    if (this.openIndex !== null) {
      // espera o browser renderizar o conteúdo aberto e então atualiza a altura
      setTimeout(() => this.calculateHeights(), 60);
    }
  }
}