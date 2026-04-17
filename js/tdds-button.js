class TddsButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._update();
  }

  connectedCallback() {
    this._render();
    this._update();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          
          /* USWDS / TDDS Tokens */
          --tdds-primary: #0053a2;
          --tdds-primary-dark: #083c6f;
          --tdds-primary-darkest: #1c2936;
          --tdds-danger: #d0021b;
          --tdds-danger-dark: #b00017;
          --tdds-danger-darkest: #930012;
          --tdds-white: #ffffff;
          --tdds-black: #212121;
          --tdds-base-light: #dadada;
        }
        
        button {
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out;
          width: auto;
          white-space: nowrap;
          box-sizing: border-box;
        }

        button:focus {
          outline: 0.25rem solid #2491ff;
          outline-offset: 0.125rem;
        }

        /* Primary Variant */
        .primary {
          background-color: var(--tdds-primary);
          color: var(--tdds-white);
        }
        .primary:hover {
          background-color: var(--tdds-primary-dark);
        }
        .primary:active {
          background-color: var(--tdds-primary-darkest);
        }

        /* Outline Variant */
        .outline {
          background-color: transparent;
          color: var(--tdds-primary);
          border: 2px solid var(--tdds-primary);
        }
        .outline:hover {
          color: var(--tdds-primary-dark);
          border-color: var(--tdds-primary-dark);
          background-color: rgba(0, 83, 162, 0.05);
        }
        .outline:active {
          color: var(--tdds-primary-darkest);
          border-color: var(--tdds-primary-darkest);
          background-color: rgba(0, 83, 162, 0.1);
        }

        /* Danger Variant */
        .danger {
          background-color: var(--tdds-danger);
          color: var(--tdds-white);
        }
        .danger:hover {
          background-color: var(--tdds-danger-dark);
        }
        .danger:active {
          background-color: var(--tdds-danger-darkest);
        }

        /* Sizes */
        .size-default {
          font-size: 16px;
          padding: 12px 20px;
        }
        .size-small {
          font-size: 11px;
          padding: 8px 16px;
        }
        .size-large {
          font-size: 20px;
          padding: 16px 24px;
        }

        /* Disabled state */
        button:disabled {
          background-color: var(--tdds-base-light) !important;
          color: var(--tdds-black) !important;
          border-color: var(--tdds-base-light) !important;
          cursor: not-allowed;
          opacity: 0.7;
        }
      </style>
      <button type="button">
        <slot></slot>
      </button>
    `;
    this._btn = this.shadowRoot.querySelector('button');
  }

  _update() {
    if (!this._btn) return;

    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'default';
    const isDisabled = this.hasAttribute('disabled');

    this._btn.className = `${variant} size-${size}`;
    this._btn.disabled = isDisabled;
  }
}

customElements.define('tdds-button', TddsButton);
