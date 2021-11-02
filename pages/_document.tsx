import Document, { Html, Head, Main, NextScript } from "next/document";

const env = process.env.NODE_ENV;
const inDev = env === "development";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
          {!inDev && (
            <script
              async
              defer
              data-website-id="b548cc69-60e7-4439-8ede-a2fcd3338ff0"
              src="https://google-analytics-sucks.herokuapp.com/umami.js"
            ></script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
