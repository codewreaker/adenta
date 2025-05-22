import { LiveEditor } from "@adenta/ui";
import "./App.css";

function App() {
	return (
		<div className="app-container">
			<div className="editor-container">
				<LiveEditor sandboxPath="/sandbox.html" />
			</div>
		</div>
	);
}

export default App;
