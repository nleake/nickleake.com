class TddsDatePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isOpen = false;
    this._selectedDate = null;
    this._currentViewDate = new Date();
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const label = this.getAttribute('label') || 'Date';
    const hint = this.getAttribute('hint') || '';
    const placeholder = this.getAttribute('placeholder') || 'mm/dd/yyyy';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --tdds-primary: #0053a2;
          --tdds-base-darkest: #3d3d3d;
          --tdds-base-lightest: #f5f5f5;
          --tdds-base-dark: #828282;
          --tdds-ink-black: #212121;
          --tdds-primary-light: #2d8fe8;
          position: relative;
          width: 350px;
        }

        .datepicker-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label {
          font-size: 16px;
          line-height: 20px;
          color: var(--tdds-ink-black);
          font-weight: 400;
        }

        .hint {
          font-size: 16px;
          line-height: 16px;
          color: var(--tdds-base-darkest);
          margin-bottom: 4px;
        }

        .input-wrapper {
          display: flex;
          align-items: stretch;
          height: 40px;
        }

        input {
          flex: 1;
          border: 1px solid var(--tdds-base-darkest);
          border-radius: 4px 0 0 4px;
          padding: 8px;
          font-size: 16px;
          font-family: inherit;
          box-sizing: border-box;
          outline: none;
        }

        input:focus {
          outline: 2px solid var(--tdds-primary-light);
          outline-offset: -1px;
        }

        .toggle-button {
          background-color: transparent;
          border: 1px solid var(--tdds-base-darkest);
          border-left: none;
          border-radius: 0 4px 4px 0;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }

        .toggle-button:hover {
          background-color: var(--tdds-base-lightest);
        }

        .toggle-button svg {
          width: 20px;
          height: 20px;
        }

        /* Calendar Popover */
        .calendar-popover {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          background: white;
          border: 1px solid var(--tdds-base-darkest);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          z-index: 10;
          width: 280px;
          display: none;
          padding: 8px;
          color: var(--tdds-ink-black);
        }

        .calendar-popover.open {
          display: block;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--tdds-base-lightest);
          margin-bottom: 8px;
        }

        .header-title {
          font-weight: 700;
          font-size: 16px;
        }

        .nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .nav-btn:hover {
          background-color: var(--tdds-base-lightest);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .day-name {
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          padding: 4px;
          color: var(--tdds-base-dark);
        }

        .day {
          text-align: center;
          padding: 8px 0;
          cursor: pointer;
          font-size: 14px;
          border-radius: 4px;
        }

        .day:hover {
          background-color: var(--tdds-base-lightest);
        }

        .day.selected {
          background-color: var(--tdds-primary);
          color: white;
        }

        .day.other-month {
          color: var(--tdds-base-dark);
        }

        .hidden {
          display: none;
        }
      </style>
      <div class="datepicker-container">
        <label class="label">${label}</label>
        ${hint ? `<div class="hint">${hint}</div>` : ''}
        <div class="input-wrapper">
          <input type="text" placeholder="${placeholder}" readonly>
          <button class="toggle-button" aria-label="Toggle calendar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
        <div class="calendar-popover">
          <div class="calendar-header">
            <button class="nav-btn prev-month" aria-label="Previous month">&lt;</button>
            <div class="header-title">December 2024</div>
            <button class="nav-btn next-month" aria-label="Next month">&gt;</button>
          </div>
          <div class="calendar-grid">
            <div class="day-name">S</div>
            <div class="day-name">M</div>
            <div class="day-name">T</div>
            <div class="day-name">W</div>
            <div class="day-name">T</div>
            <div class="day-name">F</div>
            <div class="day-name">S</div>
            <!-- Days will be injected here -->
          </div>
        </div>
      </div>
    `;

    this._input = this.shadowRoot.querySelector('input');
    this._popover = this.shadowRoot.querySelector('.calendar-popover');
    this._toggleBtn = this.shadowRoot.querySelector('.toggle-button');
    this._headerTitle = this.shadowRoot.querySelector('.header-title');
    this._grid = this.shadowRoot.querySelector('.calendar-grid');

    this._toggleBtn.addEventListener('click', () => this._toggleCalendar());
    this.shadowRoot.querySelector('.prev-month').addEventListener('click', () => this._changeMonth(-1));
    this.shadowRoot.querySelector('.next-month').addEventListener('click', () => this._changeMonth(1));

    this._renderCalendar();
  }

  _toggleCalendar() {
    this._isOpen = !this._isOpen;
    if (this._isOpen) {
      this._popover.classList.add('open');
    } else {
      this._popover.classList.remove('open');
    }
  }

  _changeMonth(delta) {
    this._currentViewDate.setMonth(this._currentViewDate.getMonth() + delta);
    this._renderCalendar();
  }

  _renderCalendar() {
    const year = this._currentViewDate.getFullYear();
    const month = this._currentViewDate.getMonth();
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this._currentViewDate);
    
    this._headerTitle.textContent = `${monthName} ${year}`;

    // Clear existing days (keep day names)
    const dayNamesCount = 7;
    while (this._grid.children.length > dayNamesCount) {
      this._grid.removeChild(this._grid.lastChild);
    }

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayEl = document.createElement('div');
      dayEl.className = 'day other-month';
      dayEl.textContent = daysInPrevMonth - i;
      this._grid.appendChild(dayEl);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'day';
      if (this._selectedDate && 
          this._selectedDate.getDate() === i && 
          this._selectedDate.getMonth() === month && 
          this._selectedDate.getFullYear() === year) {
        dayEl.classList.add('selected');
      }
      dayEl.textContent = i;
      dayEl.addEventListener('click', () => this._selectDate(new Date(year, month, i)));
      this._grid.appendChild(dayEl);
    }

    // Next month days (to fill the grid)
    const remainingSlots = 42 - (firstDayOfMonth + daysInMonth);
    for (let i = 1; i <= remainingSlots; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'day other-month';
      dayEl.textContent = i;
      this._grid.appendChild(dayEl);
    }
  }

  _selectDate(date) {
    this._selectedDate = date;
    const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    this._input.value = formatted;
    this._toggleCalendar();
    this._renderCalendar();
    
    this.dispatchEvent(new CustomEvent('date-change', {
      detail: { date: formatted },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('tdds-datepicker', TddsDatePicker);
