import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Nav from "./nav";
import Head from "next/head";
import Header from "../../header";
import { useAuth } from "../../../lib/AuthProvider";

const GET_TEST = gql`
  query test($id: Int!) {
    test(id: $id) {
      id
      title
      code
      createdAt
      updatedAt
      author {
        team {
          name
        }
      }
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

export const TestContext = React.createContext({
  code: "",
  setCode: null,
  id: null,
  latestTestRun: null,
  loading: null,
  updateTest: null,
  runningTestId: null,
  setRunningTestId: null,
  updatingTest: null,
});

const Test = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [runningTestId, setRunningTestId] = useState(null);
  const [latestTestRun, setLatestTestRun] = useState(null);
  const { hasLoadedUser, user } = useAuth();

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

  const { loading, data: testData } = useQuery(GET_TEST, {
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

  const breadcrumbs = [
    { label: testData?.test.author.team.name, href: "/" },
    { label: testData?.test.title, href: `/test/${id}` },
  ];

  return (
    <>
      <Head>
        <title>{(breadcrumbs && breadcrumbs[0].label) || "Hilltop"}</title>
      </Head>
      <Header breadcrumbs={breadcrumbs} gravitar={user?.picture} />
      <div className="container mx-auto">
        <hr className=" mb-4 border-gray-500" />
        <Nav id={id} />
        <div className="bg-white max-w-sm rounded overflow-hidden shadow-lg p-8 mb-10">
          <h1 className="text-4xl font-semibold">{title}</h1>
        </div>
        <TestContext.Provider
          value={{
            code,
            setCode,
            id,
            title,
            updateTest,
            latestTestRun,
            loading,
            runningTestId,
            setRunningTestId,
            updatingTest,
          }}
        >
          <main>
            <div
              className="absolute bg-gray-800 z-0 w-full"
              style={{
                height: 200,
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            />
            {hasLoadedUser ? children : "Loading..."}
          </main>
        </TestContext.Provider>
      </div>
    </>
  );
};

export default Test;
