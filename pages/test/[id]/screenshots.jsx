import TestShell, { TestContext } from "../../../components/shells/test";
import { useContext } from "react";

const Test = () => {
  const { latestTestRun, loading, runningTestId, updatingTest } = useContext(
    TestContext
  );
  return (
    <>
      {loading ? (
        "Loading test..."
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Latest run</h2>
          {!!runningTestId || updatingTest ? (
            "Running test..."
          ) : (
            <>
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
