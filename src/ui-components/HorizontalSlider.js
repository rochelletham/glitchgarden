import {Util} from "@/utils/Util.js";  

export class HorizontalSlider extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    
    // Bind methods
    this._handleSliderInput = this._handleSliderInput.bind(this);
    this._handleValueInput = this._handleValueInput.bind(this);
  }

  static get observedAttributes() {
    return ['min', 'max', 'step', 'value', 'numTicks', 'valueReadOnly', 'dbconvertValue', 'displayMult'];
  }

  connectedCallback() {
    // Get initial attributes with defaults
    this._min = Number(this.getAttribute('min')) || 0;
    this._max = Number(this.getAttribute('max')) || 5;
    this._step = Number(this.getAttribute('step')) || 0.1;
    this._value = Number(this.getAttribute('value'));
    this._numTicks = Number(this.getAttribute('numTicks'));
    // handle value display different from internal value
    this._valueReadOnly = this.hasAttribute('valueReadOnly');
    this._dbconvertValue = this.hasAttribute('dbconvertValue');
    this._displayMult = this.hasAttribute('displayMult');

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
      case 'numTicks':
        this._numTicks = Number(newValue);
        break;
    }
  }

  _render() {
    const style = document.createElement('style');
    style.textContent = `
      @media only screen and (max-width: 600px)  {
        .hori-slider-container {
          max-width:70%;
        }
      }
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

      /* slider track */
      .hori-slider {
        -webkit-appearance: none;
        -moz-appearance: none;
        width:100%;
        height: 12px; 
        cursor: pointer;
        position: relative;
        /* ensure slider track is under the tickmarks/thumb */
        z-index: 1;
        align-items: center;
        outline: none;
        opacity: 0.95;
        margin: 0;
        border-radius: 3px;
        /* tickmarks and the green progress track */
        background-image:
          linear-gradient(to right, rgba(103,105,107,1) 1px, transparent 1px),
          linear-gradient(to right, rgba(159, 228, 131) var(--progress, 0%), rgba(38, 42, 45, 1) var(--progress, 0%));
        background-repeat: repeat-x, no-repeat;
        background-size: var(--tick-spacing, 30px) 100%, 100% 100%;
        background-position: calc(var(--thumb-half, 6px)) center, 0 0;
      }

      .hori-slider::-webkit-slider-runnable-track { 
        z-index: 0;
        height: 12px; 
      }
      .hori-slider::-moz-range-track { 
        z-index: 0;
        height: 12px; 
      }

      /* thumb */
      .hori-slider::-webkit-slider-thumb {
        -webkit-appearance: none; 
        appearance: none;
        transform: translateY(-25%);
        height: 33px; 
        width: 12px;
        border: 1px solid rgb(255, 255, 255);
        border-radius: 3px;
        cursor: pointer;
        background: linear-gradient(
          to right,
          transparent 38%,
          rgba(132, 137, 138, 1) 38%,
          rgba(132, 137, 138, 1) 55%,
          transparent 56%
        );
        background-color: rgb(255, 255, 255);
        position:relative;
        z-index: 3; /* above ticks */
      }

      .hori-slider::-moz-range-thumb { 
        position: relative;
        z-index: 3; 
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
        background-color: rgb(255, 255, 255);
        border: 1px solid rgba(198, 198, 198, 1);
        border-radius: 5px;
      }

      .hori-slider-value:focus {
        outline: 1px solid black; 
        background-color: rgba(132, 137, 138, 1);
        box-shadow: none; 
        color: white;
      }  

      /* handled by javascript */
      .hori-slider-tickmarks { 
        display: none; 
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type=number] { 
      -moz-appearance: textfield; }
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
        <div class = "hori-slider-tickmarks" 
              aria-hidden="true">
        </div>
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
    this._tickMarks = this.shadowRoot.querySelector('.hori-slider-tickmarks');
    
    // Prevent the default action (typing the number)
    this._valueInput.addEventListener('keydown', function(event) {
      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault(); 
      }
    });

    if (this._valueReadOnly) {
      // disable the value input 
      this._valueInput.readOnly = true;
      this._valueInput.style.pointerEvents = 'none';
      this._valueInput.style.userSelect = 'none';
      this._valueInput.tabIndex = -1;
      // block arrow keys and mouse wheel changes
      this._valueInput.addEventListener('keydown', (e) => e.preventDefault());
      this._valueInput.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    }
    // edge cases for adjusting the display in value box
    if (this._dbconvertValue) {
      // initialize display value
      this._valueInput.value = Util.lintodb(this._value).toFixed();
    } else if (this._displayMult) {
      // initialize display value
      this._valueInput.value = (this._value * 100).toFixed();
    } else {
      this._value = this._min;
      this._valueInput.value = this._min;
    }
    
    this._valueInput.addEventListener('input', this._handleValueInput);
    this._sliderInput.addEventListener('input', this._handleSliderInput);

    // handling the tick mark logistics
    const setTickMarks = () => {
      // number of intervals between min and max based on step
      // if valid numTicks not given, just calculate based on range and step
      const intervals = (!this._numTicks || this._numTicks <= 0) ? Math.round((this._max - this._min) / this._step) : this._numTicks;
      // length of the track
      const sliderRect = this._sliderInput.getBoundingClientRect();
      const containerRect = this.shadowRoot.querySelector('.hori-slider-container').getBoundingClientRect();

      // if layout not ready, retry on the next frame
      if (!sliderRect) {
        requestAnimationFrame(() => setTickMarks());
      }
      
      // use thumb width from CSS, otherwise 12px
      const sliderCS = getComputedStyle(this._sliderInput);
      const thumbWidth = parseFloat(sliderCS.getPropertyValue('--hori-thumb-width')) || 12;
      const thumbHalf = thumbWidth / 2;

      // ensure that tickmarks line up with the slider thumb center as it travels
      const travel = Math.max(0, sliderRect.width - thumbWidth);
      const tickSpacing = travel / intervals;

      this._sliderInput.style.setProperty('--thumb-half', `${thumbHalf}px`);
      this._sliderInput.style.setProperty('--tick-spacing', `${tickSpacing}px`);
      if (this._tickMarks) {
        this._tickMarks.style.setProperty('--tick-spacing', `${tickSpacing}px`);
        this._tickMarks.style.setProperty('--thumb-half', `${thumbHalf}px`);
        // position overlay exactly over the visible range input track
        const leftmargin = sliderRect.left - containerRect.left;
        this._tickMarks.style.left = `${leftmargin}px`;
        this._tickMarks.style.width = `${sliderRect.width}px`;
        this._tickMarks.style.right = 'auto';
      }
      
      // TODO: fix weird value box bug, should set to correct initial value
      // this._value = this._min > this._value ? this._min : this._value;
      this._valueInput.value = this._value;
      this._sliderInput.value = this._value;
      // set the progress bar on top of the tick marks
      const initialPercentage = this._calculateGradientPercentage(this._value);
      this._sliderInput.style.setProperty('--progress', `${initialPercentage}%`);
    };

    setTickMarks();
    this._resizeHandler = setTickMarks;

    // adjust the tick marks if the window ever resizes
    window.addEventListener('resize', this._resizeHandler);
  }

  _removeEventListeners() {
    this._valueInput.removeEventListener('input', this._handleValueInput);
    this._sliderInput.removeEventListener('input', this._handleSliderInput);
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  }

  _handleSliderInput(event) {
    const value = Number(event.target.value);
    this._value = value;
    this._valueInput.value = (this._dbconvertValue) ? Util.lintodb(value).toFixed() : value;
    this._valueInput.value = (this._displayMult) ? (this._valueInput.value * 100).toFixed() : value;
    // Update gradient with calculated percentage
    const percentage = this._calculateGradientPercentage(value);
    this._sliderInput.style.setProperty('--progress', `${percentage}%`);
    this._emitChangeEvent();
  }

  _handleValueInput(event) { 
    let value = Number(event.target.value);
    if (value >= this._min && value <= this._max) {
      this._value = value;
      this._sliderInput.value = value;
      // this._valueInput.value = value;
      // Update gradient with calculated percentage
    } else if (value < this._min) {            // just set to min
      this._value = this._min;
      this._sliderInput.value = this._min;
      this._valueInput.value = this._min;
    } else if (value > this._max) {            // just set to max
      this._value = this._max;
      this._sliderInput.value = this._max;
      this._valueInput.value = this._max;
    }
    const percentage = this._calculateGradientPercentage(value);
    this._sliderInput.style.setProperty('--progress', `${percentage}%`);
    this._emitChangeEvent();
  }

  _updateInputs() {
    if (this._valueInput && this._sliderInput) {
      if (this._dbconvertValue) {
        this._valueInput.value = Util.lintodb(this._value).toFixed();
      } else if (this._displayMult) {
        this._valueInput.value = (this._value * 100).toFixed();
      }
      this._sliderInput.value = this._value;
    }
  }

  _emitChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this._value },
      bubbles: true, // event bubbles up to parent elements
      composed: true // listeners outside shadow root can receive it
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