import { useRouter } from "next/router";
import classnames from "classnames";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { formatRelative } from "date-fns";
import gql from "graphql-tag";
import { useState, useRef } from "react";
import Nav from "./nav";
import Head from "next/head";
import Header from "../../header";
import { useAuth } from "../../../lib/AuthProvider";
import { AdjustmentsOutline } from "heroicons-react";
import Modal from "../../Modal";

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
      repeatOptions {
        every
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

const SAVE_SETTINGS = gql`
  mutation updateFlow($repeatOptions: RepeatOptionsInput, $id: Int!) {
    updateFlow(repeatOptions: $repeatOptions, id: $id) {
      id
      repeatOptions {
        every
        jobId
      }
    }
  }
`;

export const FlowContext = React.createContext({
  code: "",
  flow: null,
  setCode: null,
  id: null,
  loading: null,
  updateFlow: null,
  runningFlowId: null,
  setRunningFlowId: null,
  updatingFlow: null,
});

const Flow = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;
  const persistedFlow = useRef();
  const [flow, setFlow] = useState(null);
  const [code, setCode] = useState("");
  const [runningFlowId, setRunningFlowId] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(null);
  const { hasLoadedUser, user } = useAuth();
  const title = flow?.title;

  const [saveSettings, { loading: savingSettings }] = useMutation(
    SAVE_SETTINGS,
    {
      variables: {
        id: parseInt(id),
        repeatOptions: {
          every: parseInt(flow?.repeatOptions.every),
        },
      },
      onCompleted: ({ updateFlow }) => {
        setIsSettingsModalOpen(false);
        persistedFlow.current = {
          ...persistedFlow,
          repeatOptions: updateFlow.repeatOptions,
        };
        setFlow({ ...flow, repeatOptions: updateFlow.repeatOptions });
      },
    }
  );

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

  const { loading } = useQuery(GET_FLOW, {
    variables: { id: parseInt(id) },
    skip: !id,
    onCompleted: (data) => {
      // Todo: just use one state variable
      persistedFlow.current = data.flow;
      setFlow(data.flow);
      setCode(data.flow.code);
    },
  });

  const {} = useQuery(GET_FLOW_RUN, {
    variables: { id: parseInt(runningFlowId) },
    skip: !runningFlowId,
    pollInterval: 9000,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ flowRun }) => {
      if (!!flowRun.result) {
        setFlow({ ...flow, runs: [flowRun] });
        setRunningFlowId(null);
      }
    },
  });

  const breadcrumbs = [
    { label: flow?.author.team.name, href: "/" },
    { label: flow?.title, href: `/flow/${id}` },
  ];

  const formattedEvery = flow
    ? !!flow.repeatOptions.every
      ? `${flow?.repeatOptions.every / 1000 / 60 / 60} ${
          flow?.repeatOptions.every / 1000 / 60 / 60 > 1 ? "hours" : "hour"
        }`
      : "--"
    : "\xa0";
  const formattedCreatedAt = flow
    ? formatRelative(new Date(flow?.createdAt || null), new Date())
    : "\xa0";
  const formattedLastExecutedAt = flow
    ? formatRelative(new Date(flow?.runs[0]?.createdAt || null), new Date())
    : "\xa0";

  console.log(flow);

  return (
    <>
      <Head>
        <title>{(breadcrumbs && breadcrumbs[0].label) || "Hilltop"}</title>
      </Head>
      <Header breadcrumbs={breadcrumbs} gravitar={user?.picture} />
      <div className="container mx-auto">
        <hr className=" mb-4 border-gray-500" />
        <Nav id={id} />
        <div className="bg-white max-w-md rounded overflow-hidden shadow-lg p-8 mb-10">
          <h1
            className={classnames("text-4xl font-semibold mb-2", {
              "bg-gray-400 animate-pulse": !flow,
            })}
          >
            {!flow ? "\xa0" : title}
          </h1>
          <hr className=" mb-4 border-gray-400" />
          <div className="mb-10">
            <div className={classnames("flex mb-2")}>
              <div className="w-32 text-gray-700">Repeating:</div>
              <div
                className={classnames("font-semibold flex-grow", {
                  "bg-gray-400 animate-pulse": !flow,
                })}
              >
                {formattedEvery}
              </div>
            </div>
            <div className={classnames("flex mb-2")}>
              <div className="w-32 text-gray-700">Created:</div>
              <div
                className={classnames("font-semibold flex-grow", {
                  "bg-gray-400 animate-pulse": !flow,
                })}
              >
                {formattedCreatedAt}
              </div>
            </div>
            <div className={classnames("flex mb-2")}>
              <div className="w-32 text-gray-700">Last executed:</div>
              <div
                className={classnames("font-semibold flex-grow", {
                  "bg-gray-400 animate-pulse": !flow,
                })}
              >
                {formattedLastExecutedAt}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="outline-none bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded inline-flex items-center"
          >
            <AdjustmentsOutline className="mr-1" />
            Settings
          </button>
        </div>
        <FlowContext.Provider
          value={{
            code,
            setCode,
            id,
            flow,
            updateFlow,
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
            <Modal
              isOpen={isSettingsModalOpen}
              setIsOpen={setIsSettingsModalOpen}
              onClose={() => {
                setFlow(persistedFlow.current);
              }}
            >
              <div>
                <h1 className="text-4xl font-semibold mb-4">Edit Flow</h1>
                <hr className=" mb-4 border-gray-500" />

                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-state"
                >
                  Execute flow every
                </label>
                <div className="relative mb-6">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    value={flow?.repeatOptions.every}
                    onChange={({ target }) => {
                      const isRepeating = target.value !== "false";
                      setFlow({
                        ...flow,
                        repeatOptions: isRepeating
                          ? { every: target.value }
                          : {},
                      });
                    }}
                  >
                    <option value={false}>Not repeating</option>
                    <option value={1000 * 60 * 60 * 1}>1 hour</option>
                    <option value={1000 * 60 * 60 * 4}>4 hours</option>
                    <option value={1000 * 60 * 60 * 8}>8 hours</option>
                    <option value={1000 * 60 * 60 * 24}>24 hours</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={saveSettings}
                >
                  Save
                </button>
              </div>
            </Modal>
            {hasLoadedUser ? children : "Loading..."}
          </main>
        </FlowContext.Provider>
      </div>
    </>
  );
};

export default Flow;
