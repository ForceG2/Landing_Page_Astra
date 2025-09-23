import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-trajectory',
  imports: [],
  templateUrl: './trajectory.html',
  styleUrl: './trajectory.css'
})
export class Trajectory implements AfterViewInit {

  ngAfterViewInit(): void {
    const rocket = document.querySelector(".rocket") as HTMLElement;
    const container = document.querySelector(".trajectory-container") as HTMLElement;

    const moverFoguete = (alvo: string) => {
      const destino = document.querySelector(alvo) as HTMLElement;
      if (!destino || !rocket || !container) return;

      const destinoRect = destino.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

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

        if (progress < 1) requestAnimationFrame(animar);
      }

      animar();
    };

    document.querySelector(".moon")?.addEventListener("click", () => moverFoguete(".moon"));
    document.querySelector(".mars")?.addEventListener("click", () => moverFoguete(".mars"));
    document.querySelector(".space_station")?.addEventListener("click", () => moverFoguete(".space_station"));
    document.querySelector(".earth")?.addEventListener("click", () => moverFoguete(".earth"));
  }
}
