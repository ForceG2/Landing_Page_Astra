import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  showBackground = false;
  hidden = false;
  private lastScrollTop = 0;

  ngOnInit() {
    this.updateBackground();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop + 10) {
      this.hidden = true;
    } else if (scrollTop < this.lastScrollTop - 10) {
      this.hidden = false;
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    this.updateBackground();
  }

  private updateBackground() {
    this.showBackground = (window.scrollY || document.documentElement.scrollTop) > 0;
  }

  scrollParaSecao(event: Event, id: string) {
    event.preventDefault();
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
