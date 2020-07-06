import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import withAuth from "../components/with-auth";

import Layout from "../components/layout";
import { useFetchUser } from "../lib/user";

const CREATE_TEST_MUTATION = gql`
  mutation createTest($title: String!) {
    createTest(title: $title) {
      id
      title
    }
  }
`;

const RunTest = ({ user }) => {
  const [createTest, { loading }] = useMutation(CREATE_TEST_MUTATION);

  const handleCreateTest = () => {
    createTest({
      variables: {
        title: "first",
      },
    });
  };

  return (
    <Layout user={user} loading={loading}>
      <h1>Run Test</h1>

      {loading && <p>Loading profile...</p>}

      {!loading && user && (
        <>
          <p>Run Test:</p>
          <button onClick={() => handleCreateTest()}>Run test</button>
        </>
      )}
    </Layout>
  );
};

export default withAuth(RunTest);
