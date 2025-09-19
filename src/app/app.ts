import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const canvas = document.getElementById('fundo-estrelado') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const estrelas = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      raio: Math.random() * 1.5,
      cor: `hsl(${Math.random() * 360}, 80%, 90%)` 
    }));

    function desenharEstrelas() {
      const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradiente.addColorStop(0, '#000010');
      gradiente.addColorStop(1, '#000020');
      ctx.fillStyle = gradiente;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      estrelas.forEach(estrela => {
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.raio, 0, Math.PI * 2);
        ctx.fillStyle = estrela.cor;
        ctx.fill();
      });
    }

    function animar() {
      estrelas.forEach(estrela => {
        estrela.y += 0.2;
        if (estrela.y > canvas.height) estrela.y = 0;
      });

      desenharEstrelas();
      requestAnimationFrame(animar);
    }

    animar();
  }
}
