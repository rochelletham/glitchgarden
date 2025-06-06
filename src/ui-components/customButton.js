export class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
  }

  _render() {
    const style = document.createElement("style");
    style.textContent = `
       :host {
        margin: 5px;
        text-align: center;
        max-height: 50px;
        max-width: 60px;
        cursor: pointer;
  }`;
    const html = `
        <button class="custom-button">
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.innerHTML += html;
  }
}

// Register the custom element with the browser
customElements.define("custom-button", CustomButton);
