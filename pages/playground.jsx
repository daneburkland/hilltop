import React from "react";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";

import Layout from "../components/layout";
import { useState } from "react";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  function graphQLFetcher(graphQLParams) {
    // If I want to allow authed users to use the playground without having to
    // provide apiKey, I can create a new api/apiGraphql
    return fetch("http://localhost:5000", {
      method: "post",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(graphQLParams),
    }).then((response) => response.json());
  }
  return (
    <Layout>
      <div className="bg-white rounded overflow-hidden shadow-lg p-8 mb-10">
        <label className="mb-4">API key</label>
        <input
          value={apiKey}
          onChange={({ target }) => setApiKey(target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <div style={{ height: 1000 }}>
          <GraphiQL fetcher={graphQLFetcher} />
        </div>
      </div>
    </Layout>
  );
}
