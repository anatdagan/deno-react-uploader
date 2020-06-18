import { React } from "./deps.ts";
import SimpleReactFileUploader from "./SimpleReactFileUploader.component.tsx";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      form: any;
      input: any;
    }
  }
}

const App = () => {
  const [count, setCount] = (React as any).useState(0);

  return (
<SimpleReactFileUploader/>
  );
  

};

export default App;