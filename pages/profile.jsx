import React, { useState } from "react";
import Layout from "../components/layout";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GENERATE_API_KEY = gql`
  mutation generateApiKey {
    generateApiKey {
      prefix
      key
    }
  }
`;

export default function Profile() {
  const [newApiKey, setNewApiKey] = useState(null);
  const [generateApiKey] = useMutation(GENERATE_API_KEY, {
    onCompleted: ({ generateApiKey: { key } }) => {
      setNewApiKey(key);
    },
  });
  return (
    <Layout>
      <h1 className="text-4xl font-semibold mb-4">Account</h1>

      <h2 className="text-2xl font-semibold mb-2">API key</h2>
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
        onClick={generateApiKey}
      >
        Generate New API key
      </button>
      {newApiKey && (
        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {newApiKey}
        </div>
      )}
    </Layout>
  );
}
