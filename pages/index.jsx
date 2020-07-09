import React from "react";

import Layout from "../components/layout";
import Dashboard from "../components/dashboard";
import { useFetchUser } from "../lib/user";
import { initializeApollo } from "../lib/apolloClient";

export default function Home() {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      {loading && <p>Loading login info...</p>}

      {!loading && !user && (
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
