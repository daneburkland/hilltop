import React from "react";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";

import Layout from "../components/layout";

export default function About() {
  function graphQLFetcher(graphQLParams) {
    console.log(graphQLParams);
    return fetch("http://localhost:4000", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
    }).then((response) => response.json());
  }
  return (
    <Layout>
      <h1>Playground</h1>
      <div style={{ height: 1000 }}>
        <GraphiQL fetcher={graphQLFetcher} />
      </div>
    </Layout>
  );
}
