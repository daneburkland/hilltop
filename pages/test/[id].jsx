import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useFetchUser } from "../../lib/user";
import Editor from "../../components/Editor";

const GET_TEST = gql`
  query test($id: Int!) {
    test(id: $id) {
      id
      title
      code
      createdAt
      updatedAt
      runs {
        id
        result
        createdAt
      }
    }
  }
`;

const UPDATE_TEST_MUTATION = gql`
  mutation updateTest(
    $title: String!
    $code: String!
    $run: Boolean!
    $id: Int!
  ) {
    updateTest(title: $title, code: $code, run: $run, id: $id) {
      id
      title
    }
  }
`;

const Test = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: loadingUser } = useFetchUser();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");

  const [updateTest] = useMutation(UPDATE_TEST_MUTATION, {
    variables: {
      title,
      code,
      run: true,
      id: parseInt(id),
    },
  });

  const { data, loading } = useQuery(GET_TEST, {
    variables: { id: parseInt(id) },
    skip: !id,
    onCompleted: (data) => {
      setCode(data.test.code);
      setTitle(data.test.title);
    },
  });

  return (
    <Layout user={user} loading={loadingUser}>
      {loading ? (
        "Loading test..."
      ) : (
        <>
          <div className="max-w-sm rounded overflow-hidden shadow-lg p-8 mb-10">
            <h1 className="text-4xl font-semibold">{title}</h1>
          </div>

          <Editor code={code} setCode={setCode} className="mb-6" />

          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-10"
            onClick={updateTest}
          >
            Run now
          </button>

          <h2 className="text-2xl font-semibol">Latest runs</h2>
          <ul>
            {data?.test?.runs.map((run) => {
              return <li>{run.id}</li>;
            })}
          </ul>
        </>
      )}
    </Layout>
  );
};

export default Test;
