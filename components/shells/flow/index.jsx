import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";
import Nav from "./nav";
import Head from "next/head";
import Header from "../../header";
import { useAuth } from "../../../lib/AuthProvider";

const GET_FLOW = gql`
  query flow($id: Int!) {
    flow(id: $id) {
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
          msg
          stack
        }
      }
    }
  }
`;

const GET_FLOW_RUN = gql`
  query flowRun($id: Int!) {
    flowRun(id: $id) {
      id
      result
      createdAt
      screenshotUrls
      logs {
        level
        msg
        stack
      }
    }
  }
`;

const UPDATE_FLOW_MUTATION = gql`
  mutation updateFlow(
    $title: String!
    $code: String!
    $run: Boolean!
    $id: Int!
  ) {
    updateFlow(title: $title, code: $code, run: $run, id: $id) {
      id
      title
      runs(last: 1) {
        id
      }
    }
  }
`;

export const FlowContext = React.createContext({
  code: "",
  setCode: null,
  id: null,
  latestFlowRun: null,
  loading: null,
  updateFlow: null,
  runningFlowId: null,
  setRunningFlowId: null,
  updatingFlow: null,
});

const Flow = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [runningFlowId, setRunningFlowId] = useState(null);
  const [latestFlowRun, setLatestFlowRun] = useState(null);
  const { hasLoadedUser, user } = useAuth();

  const [updateFlow, { loading: updatingFlow }] = useMutation(
    UPDATE_FLOW_MUTATION,
    {
      variables: {
        title,
        code,
        run: true,
        id: parseInt(id),
      },
      onCompleted: ({ updateFlow }) => {
        setRunningFlowId(updateFlow.runs[0].id);
      },
    }
  );

  const { loading, data: flowData } = useQuery(GET_FLOW, {
    variables: { id: parseInt(id) },
    skip: !id,
    onCompleted: (data) => {
      setCode(data.flow.code);
      setTitle(data.flow.title);
      setLatestFlowRun(data.flow.runs[0]);
    },
  });

  const {} = useQuery(GET_FLOW_RUN, {
    variables: { id: parseInt(runningFlowId) },
    skip: !runningFlowId,
    pollInterval: 9000,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ flowRun }) => {
      if (!!flowRun.result) {
        setLatestFlowRun(flowRun);
        setRunningFlowId(null);
      }
    },
  });

  const breadcrumbs = [
    { label: flowData?.flow.author.team.name, href: "/" },
    { label: flowData?.flow.title, href: `/flow/${id}` },
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
        <FlowContext.Provider
          value={{
            code,
            setCode,
            id,
            title,
            updateFlow,
            latestFlowRun,
            loading,
            runningFlowId,
            setRunningFlowId,
            updatingFlow,
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
        </FlowContext.Provider>
      </div>
    </>
  );
};

export default Flow;
