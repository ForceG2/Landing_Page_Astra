import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-trajectory',
  templateUrl: './trajectory.html',
  styleUrls: ['./trajectory.css'],
})
export class Trajectory implements AfterViewInit {
  ngAfterViewInit(): void {
    const rocket = document.querySelector('.rocket') as HTMLElement;
    const container = document.querySelector('.trajectory-container') as HTMLElement;
    const popup = document.getElementById('popup') as HTMLElement;
    const popupTitle = document.getElementById('popup-title') as HTMLElement;
    const popupDescription = document.getElementById('popup-description') as HTMLElement;
    const closePopup = document.getElementById('close-popup') as HTMLElement;

    let origemAtual: string = 'space_station';

    const planetInfo: Record<string, { title: string; description: string; image: string }> = {
      '.earth': {
        title: 'Terra',
        description:
          'Começamos nossa jornada pelo planeta azul, apreciando oceanos, florestas e cidades vibrantes.',
        image: '/assets/images/card_earth.jpeg',
      },
      '.moon': {
        title: 'Lua',
        description:
          'O satélite da Terra nos recebe com sua superfície prateada e crateras majestosas, uma vista inesquecível que vai te fazer sentir flutuando entre estrelas.',
        image: '/assets/images/card_moon.jpeg',
      },
      '.space_station': {
        title: 'Estação Espacial',
        description:
          'Com uma parada na Estação Espacial, um laboratório futurista orbitando o planeta, onde ciência e aventura se encontram.',
        image: '/assets/images/card_space_station.jpeg',
      },
      '.mars': {
        title: 'Marte',
        description:
          'O planeta vermelho surge à frente, com suas paisagens áridas e montanhas imponentes, uma experiência única que promete emocionar todos os exploradores do espaço.',
        image: '/assets/images/card_mars.jpeg',
      },
    };

    const moverFoguete = (alvo: string) => {
      const destino = document.querySelector(alvo) as HTMLElement;
      if (!destino || !rocket || !container) return;

      const destinoRect = destino.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const distanciaSegura = 50;

      const targetX = destinoRect.left - containerRect.left - distanciaSegura + 20;
      const targetY =
        destinoRect.top - containerRect.top + destinoRect.height / 2 - rocket.offsetHeight / 2 - 10;

      let startX = rocket.offsetLeft;
      let startY = rocket.offsetTop;
      let progress = 0;

      const dx = targetX - startX;
      const dy = targetY - startY;

      const angle = Math.atan2(dy, dx) * (20 / Math.PI);
      let anguloDestino = Math.atan2(dy, dx) * (90 / Math.PI);

      if (alvo == '.earth' && origemAtual !== 'space_station') {
        anguloDestino += -180;
      }

      if (alvo == '.space_station' && origemAtual === 'mars') {
        anguloDestino += -180;
      }

      rocket.style.transform = `rotate(${anguloDestino}deg)`;

      function animarReta(callback?: () => void) {
        progress += 0.018;
        if (progress > 1) progress = 1;

        const currentX = startX + dx * progress;
        const currentY = startY + dy * progress;

        rocket.style.left = currentX + 'px';
        rocket.style.top = currentY + 'px';

        if (progress < 1) {
          requestAnimationFrame(() => animarReta(callback));
        } else if (callback) {
          callback();
        }
      }

      function animarEstacionamento() {
        const recuo = 10;
        const abaixar = 20;
        const rotacaoFinal = -47;
        let step = 0;

        const startPosX = rocket.offsetLeft;
        const startPosY = rocket.offsetTop;
        const startAngle = dx < 0 ? -angle : angle;

        function animar() {
          step += 0.04;
          if (step > 1) step = 1;

          const currentX = startPosX - recuo * Math.sin(Math.PI * step) * step;
          const currentY = startPosY + abaixar * Math.sin((Math.PI * step) / 2);

          rocket.style.left = currentX + 'px';
          rocket.style.top = currentY + 'px';

          const currentAngle = startAngle + (rotacaoFinal - startAngle) * step;
          rocket.style.transform = `rotate(${currentAngle}deg)`;

          if (step < 1) {
            requestAnimationFrame(animar);
          } else {
            origemAtual = alvo.substring(1);

            const info = planetInfo[alvo];
            if (info) {
              popupTitle.textContent = info.title;
              popupDescription.textContent = info.description;
              const popupImage = document.getElementById('popup-image') as HTMLImageElement;
              popupImage.src = info.image;
              popup.style.display = 'flex';
            }

            let floatStep = 0;
            function flutuar() {
              floatStep += 0.03;
              const offsetY = 2 * Math.sin(floatStep * Math.PI);
              const offsetX = 2 * Math.sin((floatStep * Math.PI) / 2);
              rocket.style.left = currentX + offsetX + 'px';
              rocket.style.top = currentY + offsetY + 'px';
              requestAnimationFrame(flutuar);
            }

            flutuar();
          }
        }

        animar();
      }

      animarReta(animarEstacionamento);
    };

    document.querySelector('.moon')?.addEventListener('click', () => {
      moverFoguete('.moon');
    });
    document.querySelector('.mars')?.addEventListener('click', () => {
      moverFoguete('.mars');
    });
    document.querySelector('.space_station')?.addEventListener('click', () => {
      moverFoguete('.space_station');
    });
    document.querySelector('.earth')?.addEventListener('click', () => {
      moverFoguete('.earth');
    });
    const atualizarLabels = () => {
      const planetas = ['earth', 'moon', 'space_station', 'mars'];

      planetas.forEach((planeta) => {
        const planetaEl = document.querySelector(`.${planeta}`) as HTMLElement;
        const labelEl = document.querySelector(`.${planeta}-label`) as HTMLElement;
        if (planetaEl && labelEl) {
          const rect = planetaEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const centerX = rect.left - containerRect.left - 2 + rect.width / 2;
          const centerY = rect.top - containerRect.top - 2; // 20px abaixo do planeta
          labelEl.style.left = `${centerX}px`;
          labelEl.style.top = `${centerY}px`;
        }
      });
    };

    atualizarLabels();
    window.addEventListener('resize', atualizarLabels);

    closePopup?.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }
}
