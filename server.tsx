// Importing Module
import {
    Application,
    upload,
    Router,
    React,
    ReactDOMServer
  } from "./src/deps.ts";
  
  import App from "./src/app.tsx";
  import SimpleReactFileUploader from './src/SimpleReactFileUploader.component.tsx';

  const app = new Application();
  const router = new Router();
  const browserBundlePath = "/browser.js";
  
  const js =
    `import React from "https://dev.jspm.io/react@16.13.1";
     import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
     const App = ${App};
     const SimpleReactFileUploader = ${SimpleReactFileUploader};
     ReactDOM.hydrate(React.createElement(App), document.body);`;
  
  const html =
    `<html>
      <head> 
        <script type="module" src="${browserBundlePath}"></script>
        <style>* { font-family: Helvetica; }</style>
      </head>
      <body>${(ReactDOMServer as any).renderToString(<App />)}</body>
    </html>`;

  router.get(browserBundlePath, (ctx) => {
    ctx.response.type ="application/javascript"
    ctx.response.body = js;
  })
  .post("/upload", upload('uploads', ['jpg','png'], 20000000, 10000000, true, false, true),
  async (context: any, next: any) => {
    context.response.body = context.uploadedFiles;
    console.log(context.uploadedFiles)
  },
)
  .get("/", (ctx) => {
    ctx.response.type = "text/html";
    ctx.response.body = html;
  });

  // Passing Router as middleware
  app.use(router.routes());
  app.use(router.allowedMethods());
  console.log("React SSR App listening on port 3000");
  await app.listen({ port: 3000 });