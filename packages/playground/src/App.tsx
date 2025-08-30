import './App.css';
import {logger} from "@adenta/core"

const log = logger("playground-app")

function App() {
  log.info("Hello There")
  return (
    <div className="app-container">
      <div className="editor-container">
          Sample App
      </div>
    </div>
  );
}

export default App;
