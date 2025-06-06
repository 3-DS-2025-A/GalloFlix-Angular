import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[autoScroll]'
})
export class AutoScrollDirective {
  private isDown: boolean = false;
  private startX: number = 0;
  private scrollLeft: number = 0;
  private velocity: number = 0;
  private animationFrameId: number | null = null;
  private readonly decay: number = 0.95;
  private lastScrollTime: number = 0;
  private autoScrollInterval: any = null;
  private readonly scrollMargin: number = 200; // 200px de margem para ativar scroll automático
  private readonly autoScrollSpeed: number = 10; // Velocidade do scroll automático

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.startAutoScrollCheck();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isDown = false;
    this.stopAutoScroll();
    this.applyInertia();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isDown = true;
    this.startX = event.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.stopAutoScroll();
    this.cancelAnimation();
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.isDown = false;
    this.startAutoScrollCheck();
    this.applyInertia();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDown) {
      this.checkForAutoScroll(event);
      return;
    }
    
    event.preventDefault();
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    const now = performance.now();
    
    if (this.lastScrollTime) {
      const deltaTime = now - this.lastScrollTime;
      if (deltaTime > 0) {
        this.velocity = (walk - (this.el.nativeElement.scrollLeft - this.scrollLeft)) / deltaTime;
      }
    }
    
    this.lastScrollTime = now;
    this.el.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      this.el.nativeElement.scrollLeft += event.deltaY * 2;
      event.preventDefault();
    }
  }

  private startAutoScrollCheck(): void {
    // Verifica a cada 100ms se precisa iniciar o scroll automático
    this.autoScrollInterval = setInterval(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const mouseX = rect.left + (this.el.nativeElement.scrollLeft || 0);
      // Não fazemos nada aqui, a verificação real é feita no mousemove
    }, 100);
  }

  private checkForAutoScroll(event: MouseEvent): void {
    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const elementWidth = rect.width;
    const scrollLeft = element.scrollLeft;
    const scrollWidth = element.scrollWidth;
    
    // Verifica se o mouse está a menos de 200px da borda esquerda
    if (mouseX < this.scrollMargin && scrollLeft > 0) {
      this.stopAutoScroll();
      this.autoScrollInterval = setInterval(() => {
        element.scrollLeft -= this.autoScrollSpeed;
      }, 16);
    } 
    // Verifica se o mouse está a menos de 200px da borda direita
    else if (mouseX > elementWidth - this.scrollMargin && scrollLeft < scrollWidth - elementWidth) {
      this.stopAutoScroll();
      this.autoScrollInterval = setInterval(() => {
        element.scrollLeft += this.autoScrollSpeed;
      }, 16);
    } 
    else {
      this.stopAutoScroll();
    }
  }

  private stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  private applyInertia(): void {
    if (Math.abs(this.velocity) < 0.1 || this.isDown) {
      this.velocity = 0;
      return;
    }

    this.el.nativeElement.scrollLeft += this.velocity * 16;
    this.velocity *= this.decay;

    this.animationFrameId = requestAnimationFrame(() => this.applyInertia());
  }

  private cancelAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.velocity = 0;
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    this.cancelAnimation();
  }
}