import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";

const GET_TESTS = gql`
  query myTests {
    myTests {
      id
      title
    }
  }
`;

export default function Dashboard() {
  const { loading, error, data } = useQuery(GET_TESTS);
  return (
    <div>
      <h1 className="text-4xl font-semibold mb-4">Dashboard</h1>
      {loading
        ? "Loading..."
        : data.myTests.map((test) => (
            <Link key={test.id} href={`/test/${test.id}`}>
              <div className="flex p-8 cursor-pointer hover:bg-gray-200">
                <div className="w-1/2">{test.title}</div>
                <div className="w-1/2">{test.id}</div>
              </div>
            </Link>
          ))}
    </div>
  );
}
