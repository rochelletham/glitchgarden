export class HorizontalSlider extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    
    // Bind methods
    this._handleSliderInput = this._handleSliderInput.bind(this);
    this._handleValueInput = this._handleValueInput.bind(this);
  }

  static get observedAttributes() {
    return ['min', 'max', 'step', 'value', 'tickIncrement'];
  }

  connectedCallback() {
    // Get initial attributes with defaults
    this._min = Number(this.getAttribute('min')) || 0;
    this._max = Number(this.getAttribute('max')) || 5;
    this._step = Number(this.getAttribute('step')) || 0.1;
    this._value = Number(this.getAttribute('value'));
    this._tickIncrement = Number(this.getAttribute('tickIncrement')) || 10;

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
      case 'tickIncrement':
    }
  }

  _render() {
    const style = document.createElement('style');
    style.textContent = `
      .hori-slider-container {
        background-color: rgba(62, 66, 69, 1);
        border-radius: 3px;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 480px;
        height: 40px;
        gap: 5px; 
        position: relative;
        padding: 10px;
        padding-top: 5px;
        margin-bottom: 10px;
      
      }

      .hori-slider {
        -webkit-appearance: none;
        -moz-appearance: none;
        // width: 200px;
        width:100%;
        height: 12px; 
        cursor: pointer;
        position: relative;
        align-items: center;
        background: rgba(38, 42, 45, 1);
        outline: none;
        opacity: 0.85;
        writing-mode: horizontal-tb;
        margin: 0;
        border-radius: 3px;
      }

      .hori-slider::before {
        content: ''; 
        position: absolute;
        /* left: -50%; Extend tick marks to the left */
        /* top: -50%;  */
        background: repeating-linear-gradient(
          to right, 
          transparent 10px, 
          transparent 30px, 
          rgba(103, 105, 107, 1) 31px, 
          rgba(103, 105, 107, 1) 32px 
        ); 
        z-index: -1; 
        pointer-events: none;
        height: 24px;
        width: 100%;
      }

      /* the knob of the slider */
      .hori-slider::-webkit-slider-thumb {
        -webkit-appearance: none; 
        appearance: none;
        height: 33px; 
        width: 12px;    /* because track width is 12px*/
        border: 1px solid rgb(255, 255, 255);
        border-radius: 3px;
        cursor: pointer; /* Pointer on hover */
        background: linear-gradient(  /* for creating a line on the knob */
          to right,
          transparent 38%,
          rgba(132, 137, 138, 1) 38%,
          rgba(132, 137, 138, 1) 55%,
          transparent 56%
        );
        background-color: rgb(255, 255, 255);
      }

      .hori-slider-value {
        pointer-events: auto; 
        user-select: auto;
        text-align: center;
        line-height: normal;
        padding: 1px;
        margin-left: 10px;
        margin-right: 10px;
        width: 10%;
        height: 50%;
        font-size: 12px;
        color: rgba(132, 137, 138, 1); 
        /* border: 1px solid rgba(132, 136, 138, 1); */
        /* background-color: rgba(198, 198, 198, 1); */
        background-color: rgb(255, 255, 255);
        border: 1px solid rgba(198, 198, 198, 1);
        border-radius: 5px;
        #textBox{ z-index:1000; }
      }

      .hori-slider-value:focus {
        outline: 1px solid black; 
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
      <div class="hori-slider-container">
        <input type="number" 
               class="hori-slider-value" 
               min="${this._min}"
               max="${this._max}" 
               step="${this._step}" 
               value="${this._value}">
        <input type="range" 
               class="hori-slider" 
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

  // helper function to get the correct percentage for slider bar coloring
  _calculateGradientPercentage(value) {
    return ((value - this._min) / (this._max - this._min)) * 100;
  }

  _setupEventListeners() {
    this._valueInput = this.shadowRoot.querySelector('.hori-slider-value');
    this._sliderInput = this.shadowRoot.querySelector('.hori-slider');

    this._valueInput.addEventListener('input', this._handleValueInput);
    this._sliderInput.addEventListener('input', this._handleSliderInput);
    // Update initial gradient
    const initialPercentage = this._calculateGradientPercentage(this._value);
    this._sliderInput.style.background = `linear-gradient(to right, 
    rgb(159, 228, 131) ${initialPercentage}%,
    rgba(38, 42, 45, 1) ${initialPercentage}%)`;
  }

  _removeEventListeners() {
    this._valueInput.removeEventListener('input', this._handleValueInput);
    this._sliderInput.removeEventListener('input', this._handleSliderInput);
  }

  _handleSliderInput(event) {
    const value = Number(event.target.value);
    console.log(value);
    this._value = value;
    this._valueInput.value = value;
    // Update gradient with calculated percentage
    const percentage = this._calculateGradientPercentage(value);
    this._sliderInput.style.background = `linear-gradient(to right, 
    rgb(159, 228, 131) ${percentage}%,
    rgba(38, 42, 45, 1) ${percentage}%)`;
  
  this._emitChangeEvent();
  }

  _handleValueInput(event) {
    const value = Number(event.target.value);
    if (value >= this._min && value <= this._max) {
      this._value = value;
      this._sliderInput.value = value;
      // Update gradient with calculated percentage
      const percentage = this._calculateGradientPercentage(value);
      this._sliderInput.style.background = `linear-gradient(to right, 
      rgb(159, 228, 131) ${percentage}%,
      rgba(38, 42, 45, 1) ${percentage}%)`;
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
customElements.define('horizontal-slider', HorizontalSlider);