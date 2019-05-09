import { LitElement, html, css } from 'lit-element';

class MyStyle extends LitElement {
  static get properties() {
    return {
      myBool: { type: Boolean },
    };
  }
  static get styles() {
    return css`
      p {
        font-family: Roboto;
        font-size: 16px;
        font-weight: 500;
      }
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    `;
  }
  constructor() {
    super();
    this.myBool = true;
  }
  render() {
    return html`
      <p class="${this.myBool ? 'red' : 'blue'}">style paragraph</p>
      ${this.myBool ?
        html`<p>Render some HTML if myBool is true</p>` :
        html`<p>Render some other HTML if myBool is false</p>`}
      <button @click=${this.clickHandler}>Click</button>
    `;
  }
  clickHandler(event) {
    console.log(event.target);
    this.myBool = !this.myBool;
  }
}
customElements.define('my-style', MyStyle);
