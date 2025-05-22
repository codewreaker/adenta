import React, { useState, useRef } from 'react';
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/dark.css";
import { MonacoEditorComponent } from './components/Editor/MonacoEditor';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FileTab, SUPPORTED_LANGUAGES, getLanguageFromFileName } from './components/types';
import './App.css';

const initialFiles: FileTab[] = [
  {
    id: '1',
    name: 'index.tsx',
    language: 'typescript',
    content: 'import React from "react";\n\nexport const App = () => {\n  return <div>Hello World</div>;\n};'
  },
  {
    id: '2',
    name: 'styles.css',
    language: 'css',
    content: '.app {\n  padding: 20px;\n}'
  }
];

const initialJson = {
  global: {
    tabEnableFloat: true,
    tabSetMinWidth: 100,
    tabSetMinHeight: 100,
    borderRadius: 0
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 50,
        children: [
          {
            type: "tab",
            name: "index.tsx",
            component: "editor",
            config: { fileId: "1" }
          }
        ]
      },
      {
        type: "tabset",
        weight: 50,
        children: [
          {
            type: "tab",
            name: "styles.css",
            component: "editor",
            config: { fileId: "2" }
          }
        ]
      }
    ]
  }
};

function App() {
  const [files, setFiles] = useState<FileTab[]>(initialFiles);
  const layoutRef = useRef<FlexLayout.Model>(FlexLayout.Model.fromJson(initialJson));

  const createNewFile = () => {
    const fileName = window.prompt('Enter file name (e.g., example.ts):');
    if (!fileName) return;

    const newFile: FileTab = {
      id: String(Date.now()),
      name: fileName,
      language: getLanguageFromFileName(fileName),
      content: ''
    };

    setFiles(prev => [...prev, newFile]);

    // Add new tab to the layout
    const currentModel = layoutRef.current;
    const activeTabset = currentModel.getActiveTabset();
    
    if (activeTabset) {
      currentModel.doAction(
        FlexLayout.Actions.addNode(
          {
            type: "tab",
            name: fileName,
            component: "editor",
            config: { fileId: newFile.id }
          },
          activeTabset.getId(),
          FlexLayout.DockLocation.CENTER,
          -1
        )
      );
    }
  };

  const factory = (node: FlexLayout.TabNode) => {
    const component = node.getComponent();
    if (component === "editor") {
      const fileId = node.getConfig()?.fileId;
      const file = files.find(f => f.id === fileId);
      if (!file) return null;

      return (
        <MonacoEditorComponent
          file={file}
          onContentChange={(newContent) => {
            setFiles(prev => 
              prev.map(f => f.id === fileId ? { ...f, content: newContent } : f)
            );
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      <Sidebar onNewFile={createNewFile} />
      <div className="editor-container">
        <FlexLayout.Layout
          model={layoutRef.current}
          factory={factory}
          onModelChange={() => {
            // We can persist layout changes here if needed
          }}
        />
      </div>
    </div>
  );
}

export default App;
