import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Layout from "../../components/layout";
import { useFetchUser } from "../../lib/user";
import Editor from "../../components/Editor";

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
        logs
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
      logs
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

          <h2 className="text-2xl font-semibold mb-4">Latest run</h2>
          {!!runningTestId || updatingTest ? (
            "Running test..."
          ) : (
            <>
              <h4 className="text-large font-semibold">Result</h4>
              <div>{latestTestRun?.result}</div>
              <h4 className="text-large font-semibold">logs</h4>
              <div>{latestTestRun?.logs}</div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Test;
