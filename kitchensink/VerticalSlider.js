export class VerticalSlider extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    
    // Bind methods
    this._handleSliderInput = this._handleSliderInput.bind(this);
    this._handleValueInput = this._handleValueInput.bind(this);
  }

  static get observedAttributes() {
    return ['min', 'max', 'step', 'value'];
  }

  connectedCallback() {
    // Get initial attributes with defaults
    this._min = Number(this.getAttribute('min')) || 0;
    this._max = Number(this.getAttribute('max')) || 100;
    this._step = Number(this.getAttribute('step')) || 1;
    this._value = Number(this.getAttribute('value')) || 0;
    
    this._render();
    this._setupEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'min':
      case 'max':
      case 'step':
      case 'value':
        this[`_${name}`] = Number(newValue);
        this._updateInputs();
        break;
    }
  }

  _render() {
    const style = document.createElement('style');
    style.textContent = `
      .vert-slider-container {
        background-color: rgba(62, 66, 69, 1);
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 170px;
        width: 36px;
        padding-top: 10px;
        padding-bottom:5px;
        gap: 5px; 
      }

      .vert-slider {
        -webkit-appearance: none;
        -moz-appearance: none;

        writing-mode: vertical-lr;
        direction: rtl;

        border-radius: 3px;
        height: 200px;
        width: 12px; 
        cursor: pointer;
        position: relative;
        align-items: center;
        background: rgba(38, 42, 45, 1);
        outline: none;
        opacity: 0.85;
      }

      .vert-slider::before {
        content: '';
        position: absolute;
        left: -50%; /* Extend tick marks to the left */
        top: 0; 
        background: repeating-linear-gradient(
          to top,
          transparent 5px, 
          transparent 15px, 
          rgba(103, 105, 107, 1) 6px, 
          rgba(103, 105, 107, 1) 16px 
        );
        z-index: -1; 
        pointer-events: none;
        width: 24px;
        height: 100%;
      }

      /* the knob of the slider */
      .vert-slider::-webkit-slider-thumb {
        -webkit-appearance: none; 
        appearance: none;
        width: 20px; /* because track width is 12px*/
        height: 10px;
        border: 1px solid rgb(255, 255, 255);
        border-radius: 3px;
        cursor: pointer; /* Pointer on hover */
        background: linear-gradient(
          to top,
          transparent 38%,
          rgba(132, 137, 138, 1) 38%,
          rgba(132, 137, 138, 1) 55%,
          transparent 56%
        );
        background-color: rgb(255, 255, 255);
      }

      .vert-slider-value {
        pointer-events: auto; 
        user-select: auto;
        /* padding: 5px; */
        width: 60%;
        text-align: center;
        font-size: 12px;
        color: rgba(132, 137, 138, 1); 
        /* border: 1px solid rgba(132, 136, 138, 1); */
        /* background-color: rgba(198, 198, 198, 1); */
        background-color: rgb(255, 255, 255);
        border: 1px solid rgba(198, 198, 198, 1);
        border-radius: 5px;
        #textBox{ z-index:1000; }
      }

      .vert-slider-value:focus {
        outline: 1px solid black; 
        /* background-color: rgba(132, 136, 138, 1); */
        background-color: rgba(132, 137, 138, 1);
        box-shadow: none; 
        color: white;
      }  

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type=number] {
        -moz-appearance: textfield;
      }
    `;

    const html = `
      <div class="vert-slider-container">
        <input type="number" 
               class="vert-slider-value" 
               min="${this._min}"
               max="${this._max}" 
               step="${this._step}" 
               value="${this._value}">
        <input type="range" 
               class="vert-slider" 
               min="${this._min}" 
               max="${this._max}" 
               step="${this._step}" 
               value="${this._value}">
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.innerHTML += html;
  }

  _setupEventListeners() {
    this._valueInput = this.shadowRoot.querySelector('.vert-slider-value');
    this._sliderInput = this.shadowRoot.querySelector('.vert-slider');

    this._valueInput.addEventListener('input', this._handleValueInput);
    this._sliderInput.addEventListener('input', this._handleSliderInput);
    this._sliderInput.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${this._sliderInput.value}%,
     rgba(38, 42, 45, 1) ${this._sliderInput.value}%)`;
  }

  _removeEventListeners() {
    this._valueInput.removeEventListener('input', this._handleValueInput);
    this._sliderInput.removeEventListener('input', this._handleSliderInput);
  }

  _handleSliderInput(event) {
    const value = Number(event.target.value);
    this._value = value;
    this._valueInput.value = value;
    this._sliderInput.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${this._sliderInput.value}%,
     rgba(38, 42, 45, 1) ${this._sliderInput.value}%)`;
    this._emitChangeEvent();
  }

  _handleValueInput(event) {
    const value = Number(event.target.value);
    if (value >= this._min && value <= this._max) {
      this._value = value;
      this._sliderInput.value = value;
      this._sliderInput.style.background = `linear-gradient(to top, rgba(7, 235, 123, 1) ${this._sliderInput.value}%,
     rgba(38, 42, 45, 1) ${this._sliderInput.value}%)`;
      this._emitChangeEvent();
    }
  }

  _updateInputs() {
    if (this._valueInput && this._sliderInput) {
      this._valueInput.value = this._value;
      this._sliderInput.value = this._value;
    }
  }

  _emitChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this._value },
      bubbles: true,
      composed: true
    }));
  }

  // Public getters and setters
  get value() {
    return this._value;
  }

  set value(newValue) {
    const value = Number(newValue);
    if (value >= this._min && value <= this._max) {
      this._value = value;
      this._updateInputs();
      this._emitChangeEvent();
    }
  }
}

// Register the custom element
customElements.define('vertical-slider', VerticalSlider);