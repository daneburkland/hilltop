import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Nav from "./nav";
import Head from "next/head";
import Header from "../../header";
import { useAuth } from "../../../lib/AuthProvider";

const GET_USER = gql`
  query user {
    user {
      name
      team {
        name
      }
    }
  }
`;

const DashboardShell = ({ children }) => {
  const { user, hasLoadedUser } = useAuth();
  const { data: userData } = useQuery(GET_USER);

  const breadcrumbs = [{ label: userData?.user.team.name, href: "/" }];

  return (
    <>
      <Head>
        <title>{(breadcrumbs && breadcrumbs[0].label) || "Hilltop"}</title>
      </Head>
      <Header breadcrumbs={breadcrumbs} gravitar={user?.picture} />
      <div className="container mx-auto">
        <hr className=" mb-4 border-gray-500" />
        <Nav />

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
      </div>
    </>
  );
};

export default DashboardShell;
