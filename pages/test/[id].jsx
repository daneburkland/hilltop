import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Layout from "../../components/layout";
import { useFetchUser } from "../../lib/user";
import Editor from "../../components/Editor";
import classnames from "classnames";

const GET_TEST = gql`
  query test($id: Int!) {
    test(id: $id) {
      id
      title
      code
      createdAt
      updatedAt
      runs(last: 1) {
        id
        result
        createdAt
        screenshotUrls
        logs {
          level
          time
          msg
          stack
        }
      }
    }
  }
`;

const GET_TEST_RUN = gql`
  query testRun($id: Int!) {
    testRun(id: $id) {
      id
      result
      createdAt
      screenshotUrls
      logs {
        level
        time
        msg
        stack
      }
    }
  }
`;

const UPDATE_TEST_MUTATION = gql`
  mutation updatedTest(
    $title: String!
    $code: String!
    $run: Boolean!
    $id: Int!
  ) {
    updateTest(title: $title, code: $code, run: $run, id: $id) {
      id
      title
      runs(last: 1) {
        id
      }
    }
  }
`;

function Level({ level }) {
  switch (level) {
    case 50:
      return <span className="text-red-400">Error</span>;
    default:
      return <span>Info</span>;
  }
}

const Test = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: loadingUser } = useFetchUser();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [runningTestId, setRunningTestId] = useState(null);
  const [latestTestRun, setLatestTestRun] = useState(null);

  const [updateTest, { loading: updatingTest }] = useMutation(
    UPDATE_TEST_MUTATION,
    {
      variables: {
        title,
        code,
        run: true,
        id: parseInt(id),
      },
      onCompleted: ({ updateTest }) => {
        setRunningTestId(updateTest.runs[0].id);
      },
    }
  );

  const { loading } = useQuery(GET_TEST, {
    variables: { id: parseInt(id) },
    skip: !id,
    onCompleted: (data) => {
      setCode(data.test.code);
      setTitle(data.test.title);
      setLatestTestRun(data.test.runs[0]);
    },
  });

  const { loading: pollingTestRun } = useQuery(GET_TEST_RUN, {
    variables: { id: parseInt(runningTestId) },
    skip: !runningTestId,
    pollInterval: 9000,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ testRun }) => {
      if (!!testRun.result) {
        setLatestTestRun(testRun);
        setRunningTestId(null);
      }
    },
  });

  return (
    <Layout user={user} loading={loadingUser}>
      {loading ? (
        "Loading test..."
      ) : (
        <>
          <div className="max-w-sm rounded overflow-hidden shadow-lg p-8 mb-10">
            <h1 className="text-4xl font-semibold">{title}</h1>
          </div>

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
    </Layout>
  );
};

export default Test;
