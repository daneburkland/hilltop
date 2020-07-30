import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Layout from "../components/layout";
import Dashboard from "../components/dashboard";
import { initializeApollo } from "../lib/apolloClient";
import { useAuth } from "../lib/AuthProvider";

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

export default function Home() {
  const { user } = useAuth();
  const { data: userData } = useQuery(GET_USER);

  return (
    <Layout breadcrumbs={[{ label: userData?.user.team.name }]}>
      {!user && (
        <>
          <p>
            To test the login click in <i>Login</i>
          </p>
          <p>
            Once you have logged in you should be able to click in{" "}
            <i>Profile</i> and <i>Logout</i>
          </p>
        </>
      )}

      {user && <Dashboard />}
    </Layout>
  );
}

export async function getStaticProps(ctx) {
  const apolloClient = initializeApollo();

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    unstable_revalidate: 1,
  };
}
