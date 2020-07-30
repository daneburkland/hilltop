import React from "react";
import Dashboard from "../components/dashboard";
import { initializeApollo } from "../lib/apolloClient";
import DashboardShell from "../components/shells/dashboard/";

export default function Home() {
  return <Dashboard />;
}

Home.Shell = DashboardShell;

export async function getStaticProps(ctx) {
  const apolloClient = initializeApollo();

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    unstable_revalidate: 1,
  };
}
