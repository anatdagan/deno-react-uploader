// Importing Modules
import {
    Application,
    upload,
    Router,
    React,
    ReactDOMServer
  } from "./src/deps.ts";
  // React Modules
  import App from "./src/app.tsx";
  import SimpleReactFileUploader from './src/SimpleReactFileUploader.component.tsx';

  //global constants
  const app = new Application();
  const router = new Router();
  
  //Adding a route for js code to use i the browser
  const browserBundlePath = "/browser.js";  
  //js for client side React - the React components are stored as client side consts
  const js =
    `import React from "https://dev.jspm.io/react@16.13.1";
     import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
     const App = ${App};
     const SimpleReactFileUploader = ${SimpleReactFileUploader};
     ReactDOM.hydrate(React.createElement(App), document.body);`;
  
  //the js code is loaded from a script tag
  const html =
    `<html>
      <head> 
        <script type="module" src="${browserBundlePath}"></script>
        <style>* { font-family: Helvetica; }</style>
      </head>
      <body>${(ReactDOMServer as any).renderToString(<App />)}</body>
    </html>`;
  
  //setting the routes
  router.get(browserBundlePath, (ctx) => { //the js code that is loaded from script tag
    ctx.response.type ="application/javascript"
    ctx.response.body = js;
  })
  .post("/upload", upload('uploads', ['jpg','png'], 20000000, 10000000, true, false, true), //using oak upload middleware
  async (context: any, next: any) => {
    //return the uploadedFiles data to the response
    context.response.body = context.uploadedFiles;
    console.log(context.uploadedFiles)
  })
  .get("/", (ctx) => { //default route
    ctx.response.type = "text/html";
    ctx.response.body = html;
  });

  // Passing Router as middleware
  app.use(router.routes());
  app.use(router.allowedMethods());

  //start server
  console.log("React SSR App listening on port 3000");
  await app.listen({ port: 3000 });