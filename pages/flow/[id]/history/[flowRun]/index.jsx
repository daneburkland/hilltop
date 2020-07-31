import Editor from "../../../../../components/Editor";
import classnames from "classnames";
import FlowRunShell, {
  FlowRunContext,
} from "../../../../../components/shells/flowRun";
import { useContext } from "react";

function Level({ level }) {
  switch (level) {
    case 50:
      return <span className="text-red-400">Error</span>;
    default:
      return <span>Info</span>;
  }
}

const FlowRun = () => {
  const { flowRun } = useContext(FlowRunContext);

  return (
    <>
      <Editor code={flowRun?.flow.code} className="mb-6" />

      <div className="mb-4">
        <h4 className="text-xl font-semibold">Result</h4>
        <pre className="bg-gray-800 text-white overflow-scroll p-2">
          <div>{flowRun?.result}</div>
        </pre>
      </div>
      <div className="mb-4">
        <h4 className="text-xl font-semibold">Logs</h4>
        <pre
          className="bg-gray-800 overflow-scroll p-2"
          style={{ maxHeight: 400 }}
        >
          {flowRun?.logs.map((log) => (
            <div className="text-white">
              <Level level={log.level} />
              {` ${log.time}: `}
              <span
                className={classnames({
                  "text-red-400": log.level === 50,
                })}
              >
                {log.msg}
              </span>
              {log.stack && <div className="text-red-400">{log.stack}</div>}
            </div>
          ))}
        </pre>
      </div>
      <div className="mb-4">
        <h4 className="text-xl font-semibold">Logs</h4>
        <div>
          {flowRun?.screenshotUrls.map((url) => {
            return <img src={url} />;
          })}
        </div>
      </div>
    </>
  );
};

FlowRun.Shell = FlowRunShell;

export default FlowRun;
