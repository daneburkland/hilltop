import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Layout from "../components/layout";
import { useFetchUser } from "../lib/user";
import Editor from "../components/Editor";

const CREATE_TEST_MUTATION = gql`
  mutation createTest($title: String!, $code: String!) {
    createTest(title: $title, code: $code) {
      id
      title
    }
  }
`;

const defaultCode = `const assert = require('assert');
module.exports = async function({ page }) {
  await page.goto('https://checklyhq.com/')

  // get the text of the button
  const buttonText = await page.$eval('a.btn-lg', el => el.innerText)
  
  // assert using built-in assert function
  try{
    assert.equal(buttonText, 'Start your free trial')
    return true;
  } catch(e) {
    return e;
  }

}
`;

const RunTest = () => {
  const [code, setCode] = React.useState(defaultCode);
  const [createTest] = useMutation(CREATE_TEST_MUTATION);
  const { user, loading } = useFetchUser();
  console.log(code);

  const handleCreateTest = () => {
    createTest({
      variables: {
        title: "first",
        code,
      },
    });
  };

  return (
    <Layout user={user} loading={loading}>
      <h1 className="text-2xl font-semibold mb-4">Create new test</h1>

      {loading && <p>Loading profile...</p>}

      <Editor code={code} setCode={setCode} />

      {!loading && user && (
        <>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
            onClick={() => handleCreateTest()}
          >
            Create test
          </button>
        </>
      )}
    </Layout>
  );
};

export default RunTest;
