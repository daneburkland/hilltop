import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
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
      runs {
        id
        result
      }
    }
  }
`;

const Test = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: loadingUser } = useFetchUser();

  const { data, loading } = useQuery(GET_TEST, {
    variables: { id: parseInt(id) },
    skip: !id,
    onCompleted: (data) => {
      setCode(data.test.code);
    },
  });
  const [code, setCode] = useState("");

  return (
    <Layout user={user} loading={loadingUser}>
      {loading ? (
        "Loading test..."
      ) : (
        <>
          <div className="max-w-sm rounded overflow-hidden shadow-lg p-8">
            <h1 className="text-2xl font-semibold">{data?.test?.title}</h1>
          </div>

          <Editor code={code} setCode={setCode} />
        </>
      )}
    </Layout>
  );
};

export default Test;
