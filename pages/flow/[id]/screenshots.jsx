import FlowShell, { FlowContext } from "../../../components/shells/flow";
import { useContext } from "react";

const Flow = () => {
  const { latestFlowRun, loading, runningFlowId, updatingFlow } = useContext(
    FlowContext
  );
  return (
    <>
      {loading ? (
        "Loading flow..."
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Latest run</h2>
          {!!runningFlowId || updatingFlow ? (
            "Running flow..."
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-xl font-semibold">Logs</h4>
                <div>
                  {latestFlowRun?.screenshotUrls.map((url) => {
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

Flow.Shell = FlowShell;

export default Flow;
