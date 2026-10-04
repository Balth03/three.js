/** Full-screen loading view with progress. */
export class LoadingScreen {
  private el: HTMLDivElement;
  private bar: HTMLDivElement;
  private label: HTMLDivElement;
  constructor(root: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'loading';
    this.el.innerHTML = `
      <div class="loading-inner">
        <div class="brand"><span class="brand-mark">TAXI</span><span class="brand-dot">·</span><span class="brand-name">MONDE</span></div>
        <div class="loading-city">Paris</div>
        <div class="loading-bar"><div></div></div>
        <div class="loading-label"></div>
        <div class="loading-credit">© OpenStreetMap contributors · Overture Maps Foundation</div>
      </div>`;
    root.appendChild(this.el);
    this.bar = this.el.querySelector('.loading-bar > div') as HTMLDivElement;
    this.label = this.el.querySelector('.loading-label') as HTMLDivElement;
  }
  set(p: number, label: string): void {
    this.bar.style.width = `${Math.round(Math.min(1, Math.max(0, p)) * 100)}%`;
    this.label.textContent = label;
  }
  hide(): void {
    this.el.classList.add('done');
    setTimeout(() => this.el.remove(), 900);
  }
}
