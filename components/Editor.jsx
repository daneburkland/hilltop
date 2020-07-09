import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

function Editor({ code, setCode }) {
  return (
    <MonacoEditor
      editorDidMount={() => {
        window.MonacoEnvironment.getWorkerUrl = (_moduleId, label) => {
          return "_next/static/editor.worker.js";
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
  );
}

export default Editor;
