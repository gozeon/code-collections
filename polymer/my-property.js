import { LitElement, html } from 'lit-element';

class MyProperty extends LitElement {
  static get properties() {
    return { message: { type: String } };
  }
  constructor() {
    super();
    this.message='Hello world! From my-element';
  }
  render() {
    return html`
      <p>${this.message}</p>
    `;
  }
}
customElements.define('my-property', MyProperty);
