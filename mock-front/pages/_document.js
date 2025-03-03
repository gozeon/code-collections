/* eslint-disable react/no-danger, import/no-unresolved */
import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { extractStyles } from "evergreen-ui";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    // `css` is a string with css from both glamor and ui-box.
    // No need to get the glamor css manually if you are using it elsewhere in your app.
    //
    // `hydrationScript` is a script you should render on the server.
    // It contains a stringified version of the glamor and ui-box caches.
    // Evergreen will look for that script on the client and automatically hydrate
    // both glamor and ui-box.
    const { css, hydrationScript } = extractStyles();

    return {
      ...page,
      css,
      hydrationScript
    };
  }

  render() {
    const { css, hydrationScript } = this.props;

    return (
      <Html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <style>{`body { margin: 0 } /* custom! */`}</style>
          <link rel="icon" type="image/x-icon" href="/static/166521.png" />
        </Head>

        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    );
  }
}
