import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
// import Nav from "./nav";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../header";
import { useAuth } from "../../../lib/AuthProvider";
import { formatRelative } from "date-fns";

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
      test {
        code
        title
        author {
          name
        }
      }
    }
  }
`;

export const TestRunContext = React.createContext({
  testRun: null,
});

const TestRunShell = ({ children }) => {
  const { user, hasLoadedUser } = useAuth();
  const router = useRouter();
  const { id, testRun } = router.query;
  const { data } = useQuery(GET_TEST_RUN, {
    skip: !testRun,
    variables: {
      id: parseInt(testRun),
    },
  });

  const breadcrumbs = [
    { label: data?.testRun.test.author.name, href: `/` },
    { label: data?.testRun.test.title, href: `/test/${id}` },
    {
      label: data
        ? formatRelative(new Date(data?.testRun.createdAt), new Date())
        : undefined,
      href: `/test/${id}/history/${testRun}`,
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

        <TestRunContext.Provider value={{ testRun: data?.testRun }}>
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
        </TestRunContext.Provider>
      </div>
    </>
  );
};

export default TestRunShell;
