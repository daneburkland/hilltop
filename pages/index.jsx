import React from "react";

import Layout from "../components/layout";
import Dashboard from "../components/dashboard";
import { initializeApollo } from "../lib/apolloClient";
import { useAuth } from "../lib/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <Layout>
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
