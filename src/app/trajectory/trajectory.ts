import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-trajectory',
  templateUrl: './trajectory.html',
  styleUrls: ['./trajectory.css']
})
export class Trajectory implements AfterViewInit {

  ngAfterViewInit(): void {
    const rocket = document.querySelector(".rocket") as HTMLElement;
    const container = document.querySelector(".trajectory-container") as HTMLElement;
    const popup = document.getElementById("popup") as HTMLElement;
    const popupTitle = document.getElementById("popup-title") as HTMLElement;
    const popupDescription = document.getElementById("popup-description") as HTMLElement;
    const closePopup = document.getElementById("close-popup") as HTMLElement;

    const planetInfo: Record<string, { title: string, description: string, image: string }> = {
      ".earth": { title: "Terra", 
        description: "Começamos nossa jornada pelo planeta azul, apreciando oceanos, florestas e cidades vibrantes – o ponto de partida perfeito para nossa viagem.",
        image: "/assets/images/card_earth.jpeg" },
      ".moon": { title: "Lua", description: "O satélite da Terra nos recebe com sua superfície prateada e crateras majestosas – uma vista inesquecível que vai te fazer sentir flutuando entre estrelas.",
        image: "/assets/images/card_moon.jpeg" },
      ".space_station": { title: "Estação Espacial", description: "Com uma parada na Estação Espacial, um laboratório futurista orbitando o planeta, onde ciência e aventura se encontram.",
        image: "/assets/images/card_space_station.jpeg" },
      ".mars": { title: "Marte", description: "O planeta vermelho surge à frente, com suas paisagens áridas e montanhas imponentes – uma experiência única que promete emocionar todos os exploradores do espaço.",
        image: "/assets/images/card_mars.jpeg" }
    };

    const moverFoguete = (alvo: string) => {
      const destino = document.querySelector(alvo) as HTMLElement;
      if (!destino || !rocket || !container) return;

      const destinoRect = destino.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const popupImage = document.getElementById("popup-image") as HTMLImageElement;
      const targetX = destinoRect.left - containerRect.left + destinoRect.width / 2 - rocket.offsetWidth / 2;
      const targetY = destinoRect.top - containerRect.top + destinoRect.height / 2 - rocket.offsetHeight / 2;

      let startX = rocket.offsetLeft;
      let startY = rocket.offsetTop;
      let progress = 0;

      const dx = targetX - startX;
      const dy = targetY - startY;

      const angle = Math.atan2(dy, dx) * (20 / Math.PI);

      if (dx < 0) {
        rocket.style.transform = `scaleX(-1) rotate(${angle}deg)`;
      } else {
        rocket.style.transform = `scaleX(1) rotate(${angle}deg)`;
      }

      function animar() {
        progress += 0.018;
        if (progress >= 1) progress = 1;

        const currentX = startX + (targetX - startX) * progress;
        const currentY = startY + (targetY - startY) * progress;

        rocket.style.left = currentX + "px";
        rocket.style.top = currentY + "px";

        if (progress < 1) {
          requestAnimationFrame(animar);
        } else {
          const info = planetInfo[alvo];
          if (info) {
            popupTitle.textContent = info.title;
            popupDescription.textContent = info.description;
            popupImage.src = info.image;
            popup.style.display = "flex";
          }
        }
      }

      animar();
    };

    document.querySelector(".moon")?.addEventListener("click", () => moverFoguete(".moon"));
    document.querySelector(".mars")?.addEventListener("click", () => moverFoguete(".mars"));
    document.querySelector(".space_station")?.addEventListener("click", () => moverFoguete(".space_station"));
    document.querySelector(".earth")?.addEventListener("click", () => moverFoguete(".earth"));

    closePopup?.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }
}
