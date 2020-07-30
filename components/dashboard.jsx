import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";
import { formatRelative } from "date-fns";

const GET_TESTS = gql`
  query myTests {
    myTests(orderBy: { updatedAt: "desc" }) {
      id
      title
      updatedAt
      author {
        name
      }
      runs(last: 1) {
        id
        createdAt
        screenshotUrls
      }
    }
  }
`;

function TestRow({ test }) {
  const latestRun = test.runs[0];
  const previewSrc =
    test.runs[0].screenshotUrls[0] || "https://via.placeholder.com/150";
  return (
    <Link key={test.id} href={`/test/${test.id}`}>
      <div className="flex items-center p-3 cursor-pointer hover:bg-gray-200">
        <img src={previewSrc} className="w-2/12 h-32" />
        <div className="text-2xl font-semibold w-5/12 ml-8">{test.title}</div>
        <div className="w-5/12 text-gray-700 flex flex-col">
          <span className="text-lg">{`Created by ${test.author.name}`}</span>
          <span className="text-gray-600">
            {formatRelative(new Date(latestRun.createdAt), new Date())}
          </span>
        </div>
      </div>
    </Link>
  );
}

function TestsCard({ tests = [] }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <input
          className="w-64 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Search runs..."
        ></input>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          New Test
        </button>
      </div>
      {tests.map((test) => (
        <TestRow test={test} />
      ))}
    </>
  );
}

export default function Dashboard() {
  const { loading, error, data } = useQuery(GET_TESTS);
  return <TestsCard tests={data?.myTests} />;
}
