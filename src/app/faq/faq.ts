import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  faqs = [
    { q: 'É seguro viajar para o espaço?', a: 'A segurança é nossa prioridade máxima. Nossas naves passam por rigorosos testes e manutenções, e nossa tripulação é altamente treinada para garantir uma viagem segura.' },
    { q: 'Preciso de treinamento especial para participar?', a: 'Sim, todos os participantes passam por um treinamento preparatório que cobre todos os aspectos da viagem, desde procedimentos de segurança até como aproveitar ao máximo a experiência.' },
    { q: 'Quanto tempo dura a viagem?', a: 'A experiência completa, incluindo treinamento, dura cerca de uma semana. O voo espacial em si tem a duração de dois dias.' },
    { q: 'Vou realmente ver a Terra do espaço?', a: 'Com certeza! Nossas naves possuem janelas panorâmicas projetadas especificamente para oferecer uma vista deslumbrante e inesquecível do nosso planeta.' },
    { q: 'Qualquer pessoa pode participar?', a: 'Há requisitos básicos de saúde e idade mínima. Fazemos uma avaliação simples.' },
    { q: 'Onde acontece o lançamento da nave?', a: 'No nosso espaçoporto parceiro; o transporte está incluso.' },
  ];
}
