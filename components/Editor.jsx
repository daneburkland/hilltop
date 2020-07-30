import dynamic from "next/dynamic";
import { useRef } from "react";
import prettier from "prettier/standalone";
import babel from "prettier/parser-babel";
const MonacoEditor = dynamic(import("react-monaco-editor"), {
  ssr: false,
  loading: () => <div className="w-full bg-black" style={{ height: 600 }} />,
});

function Editor({ code, setCode, className }) {
  const monacoRef = useRef(null);

  const handleFormat = () => {
    monacoRef.current.getAction("editor.action.formatDocument").run();
  };

  return (
    <div className={className}>
      <div className="flex justify-end">
        <button
          onClick={handleFormat}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white text-sm py-1 px-3 border border-blue-500 hover:border-transparent rounded mb-1"
        >
          prettier
        </button>
      </div>
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
    </div>
  );
}

export default Editor;
