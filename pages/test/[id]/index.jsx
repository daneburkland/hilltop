import Editor from "../../../components/Editor";
import classnames from "classnames";
import TestShell, { TestContext } from "../../../components/shells/test";
import { useContext } from "react";

function Level({ level }) {
  switch (level) {
    case 50:
      return <span className="text-red-400">Error</span>;
    default:
      return <span>Info</span>;
  }
}

const Test = () => {
  const {
    code,
    setCode,
    id,
    title,
    latestTestRun,
    loading,
    updateTest,
    runningTestId,
    updatingTest,
  } = useContext(TestContext);

  return (
    <>
      {loading ? (
        "Loading test..."
      ) : (
        <>
          <Editor code={code} setCode={setCode} className="mb-6" />

          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-10"
            onClick={updateTest}
          >
            Run now
          </button>

          <h2 className="text-xl font-semibold mb-4">Latest run</h2>
          {!!runningTestId || updatingTest ? (
            "Running test..."
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-xl font-semibold">Result</h4>
                <pre className="bg-gray-800 text-white overflow-scroll p-2">
                  <div>{latestTestRun?.result}</div>
                </pre>
              </div>
              <div className="mb-4">
                <h4 className="text-xl font-semibold">Logs</h4>
                <pre
                  className="bg-gray-800 overflow-scroll p-2"
                  style={{ maxHeight: 400 }}
                >
                  {latestTestRun?.logs.map((log) => (
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
                      {log.stack && (
                        <div className="text-red-400">{log.stack}</div>
                      )}
                    </div>
                  ))}
                </pre>
              </div>
              <div className="mb-4">
                <h4 className="text-xl font-semibold">Logs</h4>
                <div>
                  {latestTestRun?.screenshotUrls.map((url) => {
                    return <img src={url} />;
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

Test.Shell = TestShell;

export default Test;
