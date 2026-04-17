class TddsAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['heading', 'open'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._update();
  }

  connectedCallback() {
    this._render();
    this._update();
  }

  toggle() {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
    } else {
      this.setAttribute('open', '');
    }
  }

  _render() {
    const contentId = 'content-' + Math.random().toString(36).substr(2, 9);
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin-bottom: 0.5rem;
          width: 100%;
          max-width: 640px;
        }
        .accordion-button {
          background-color: #f5f5f5;
          border: none;
          color: #212121;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          text-align: left;
          width: 100%;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.5;
          transition: background-color 0.2s ease-in-out;
        }
        .accordion-button:hover {
          background-color: #e6e6e6;
        }
        .accordion-button:focus {
          outline: 0.25rem solid #2491ff;
          outline-offset: -0.25rem;
        }
        .accordion-icon {
          height: 1.25rem;
          width: 1.25rem;
          transition: transform 0.2s ease-in-out;
        }
        .accordion-content {
          background-color: #ffffff;
          color: #212121;
          padding: 1rem 1.25rem;
          display: none;
          font-size: 1rem;
          line-height: 1.5;
        }
        
        /* State management via host attributes */
        :host([open]) .accordion-content {
          display: block;
        }
        :host([open]) .accordion-icon {
          transform: rotate(180deg);
        }
      </style>
      <button 
        type="button" 
        class="accordion-button" 
        id="button-${contentId}"
        aria-controls="${contentId}"
      >
        <span id="heading-text"></span>
        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div 
        id="${contentId}" 
        class="accordion-content" 
        role="region" 
        aria-labelledby="button-${contentId}"
      >
        <slot></slot>
      </div>
    `;

    this._btn = this.shadowRoot.querySelector('button');
    this._content = this.shadowRoot.querySelector('.accordion-content');
    this._headingSpan = this.shadowRoot.querySelector('#heading-text');

    this._btn.addEventListener('click', () => this.toggle());
  }

  _update() {
    if (!this._btn) return;
    
    const isOpen = this.hasAttribute('open');
    const heading = this.getAttribute('heading') || 'Accordion Item';
    
    this._headingSpan.textContent = heading;
    this._btn.setAttribute('aria-expanded', isOpen);
    
    if (isOpen) {
      this._content.removeAttribute('hidden');
    } else {
      this._content.setAttribute('hidden', '');
    }
  }
}

customElements.define('tdds-accordion', TddsAccordion);
