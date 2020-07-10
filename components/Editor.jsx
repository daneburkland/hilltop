import dynamic from "next/dynamic";
import { useRef } from "react";
import prettier from "prettier/standalone";
import babel from "prettier/parser-babel";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

function Editor({ code, setCode, className }) {
  const monacoRef = useRef(null);

  const handleFormat = () => {
    monacoRef.current.getAction("editor.action.formatDocument").run();
  };

  return (
    <div className={className}>
      <MonacoEditor
        editorWillMount={(monaco) => {
          monaco.languages.registerDocumentFormattingEditProvider(
            "javascript",
            {
              async provideDocumentFormattingEdits(model) {
                const text = prettier.format(model.getValue(), {
                  parser: "babel",
                  plugins: [babel],
                  singleQuote: true,
                });

                return [
                  {
                    range: model.getFullModelRange(),
                    text,
                  },
                ];
              },
            }
          );
        }}
        editorDidMount={(editor) => {
          monacoRef.current = editor;
          window.MonacoEnvironment.getWorkerUrl = (_moduleId, label) => {
            return "/_next/static/editor.worker.js";
          };
        }}
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={setCode}
      />
      <button onClick={handleFormat}>format</button>
    </div>
  );
}

export default Editor;
