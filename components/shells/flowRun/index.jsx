import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
// import Nav from "./nav";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../header";
import { useAuth } from "../../../lib/AuthProvider";
import { formatRelative } from "date-fns";

const GET_FLOW_RUN = gql`
  query flowRun($id: Int!) {
    flowRun(id: $id) {
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
      flow {
        code
        title
        author {
          name
        }
      }
    }
  }
`;

export const FlowRunContext = React.createContext({
  flowRun: null,
});

const FlowRunShell = ({ children }) => {
  const { user, hasLoadedUser } = useAuth();
  const router = useRouter();
  const { id, flowRun } = router.query;
  const { data } = useQuery(GET_FLOW_RUN, {
    skip: !flowRun,
    variables: {
      id: parseInt(flowRun),
    },
  });

  const breadcrumbs = [
    { label: data?.flowRun.flow.author.name, href: `/` },
    { label: data?.flowRun.flow.title, href: `/flow/${id}` },
    {
      label: data
        ? formatRelative(new Date(data?.flowRun.createdAt), new Date())
        : undefined,
      href: `/flow/${id}/history/${flowRun}`,
    },
  ];

  return (
    <>
      <Head>
        <title>{breadcrumbs[0].label || "Hilltop"}</title>
      </Head>
      <Header breadcrumbs={breadcrumbs} gravitar={user?.picture} />
      <div className="container mx-auto">
        <hr className=" mb-4 border-gray-500" />
        {/* <Nav /> */}

        <FlowRunContext.Provider value={{ flowRun: data?.flowRun }}>
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
            <div className="flex">
              <div className="bg-white rounded overflow-hidden shadow-lg p-8 mb-10 w-full">
                {hasLoadedUser ? children : "Loading..."}
              </div>
            </div>
          </main>
        </FlowRunContext.Provider>
      </div>
    </>
  );
};

export default FlowRunShell;
