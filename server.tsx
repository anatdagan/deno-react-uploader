// Importing Module
import {upload} from './src/deps.ts';
import {
    Application,

    Router,
    React,
    ReactDOMServer,
    Request,
    Response,
    NextFunction,
  } from "./src/deps.ts";
  
  import App from "./src/app.tsx";
  import SimpleReactFileUploader from './src/SimpleReactFileUploader.component.tsx';

  const app = new Application();
  const router = new Router();
  const browserBundlePath = "/browser.js";
  
  const js =
    `import React from "https://dev.jspm.io/react@16.13.1";\nimport ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";\nconst App = ${App};\nconst SimpleReactFileUploader = ${SimpleReactFileUploader};\nReactDOM.hydrate(React.createElement(App), document.body);`;
  
  const html =
    `<html><head><script type="module" src="${browserBundlePath}"></script><style>* { font-family: Helvetica; }</style></head><body>${
      (ReactDOMServer as any).renderToString(<App />)
    }</body></html>`;
  
  // Note that you wouldn't normally need to specify types for `req`, `res` and `next`.
  // Deno v1.0.1 introduced a bug where it dropped support for `.tsx` files resulting in breaking typescript errors.
  //
  // This should be fixed in Deno v1.0.3.
  //
  // REF:
  // - https://github.com/denoland/deno/issues/5776
  // - https://github.com/denoland/deno/issues/5772
  // - https://github.com/denoland/deno/pull/5785
  
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
  
