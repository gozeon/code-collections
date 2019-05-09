import { LitElement, html } from 'lit-element';

class MyEvent extends LitElement {
  static get properties() {
    return {
      message: { type: String },
      myBool: { type: Boolean },
      myArray: { type: Array }
    };
  }
  constructor() {
    super();
    this.myBool = true;
  }
  render() {
    return html`
      ${this.myBool ?
        html`<p class='red'>Render some HTML if myBool is true</p>` :
        html`<p>Render some other HTML if myBool is false</p>`}
      <button @click=${this.clickHandler}>Click</button>
    `;
  }
  clickHandler(event) {
    console.log(event.target);
    this.myBool = !this.myBool;
  }
}
customElements.define('my-event', MyEvent);
