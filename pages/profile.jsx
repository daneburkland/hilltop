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

const INVITE_TEAMMATE = gql`
  mutation inviteTeammate($email: String!) {
    inviteTeammate(email: $email) {
      email
    }
  }
`;

export default function Profile() {
  const [newApiKey, setNewApiKey] = useState(null);
  const [email, setEmail] = useState("");
  const [generateApiKey] = useMutation(GENERATE_API_KEY, {
    onCompleted: ({ generateApiKey: { key } }) => {
      setNewApiKey(key);
    },
  });

  const [handleInviteTeammate] = useMutation(INVITE_TEAMMATE, {
    variables: { email },
  });
  return (
    <Layout>
      <div className="bg-white max-w-sm rounded overflow-hidden shadow-lg p-8 mb-10">
        <h1 className="text-4xl font-semibold mb-4">Account</h1>
      </div>

      <div className="mb-4">
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
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Team members</h2>
        <div className="flex">
          <input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
          />
          <button
            onClick={handleInviteTeammate}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white text-sm py-1 px-3 border border-blue-500 hover:border-transparent rounded mb-1"
          >
            Invite teammate
          </button>
        </div>
      </div>
    </Layout>
  );
}
