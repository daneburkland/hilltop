import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DashboardShell from "../components/shells/dashboard";

const WEBHOOK_MUTATION = gql`
  mutation createWebhook(
    $resource: String!
    $onCreate: Boolean!
    $onExecute: Boolean!
    $url: String!
  ) {
    createWebhook(
      resource: $resource
      onCreate: $onCreate
      onExecute: $onExecute
      url: $url
    ) {
      id
    }
  }
`;

function Webhooks() {
  const [resource, setResource] = useState("Flow");
  const [onCreate, setOnCreate] = useState(false);
  const [onExecute, setOnExecute] = useState(false);
  const [url, setUrl] = useState(null);
  console.log({ resource, onCreate, onExecute, url });

  const [handleAddWebhook] = useMutation(WEBHOOK_MUTATION, {
    variables: { resource, onCreate, onExecute, url },
  });
  return (
    <>
      <h1 className="text-4xl font-semibold mb-4">Webhooks</h1>

      <div className="mb-4">
        <div className="w-full flex justify-between items-end">
          <div className="flex">
            <div className="mr-4 w-64">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Resource
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  value={resource}
                  onChange={({ target }) => {
                    setResource(target.value);
                  }}
                >
                  <option value="Flow">Flow</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mr-4 w-48">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Events
              </label>
              <label className="md:w-2/3 block ">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  onChange={({ target }) => setOnCreate(target.checked)}
                />
                <span className="text-sm">Created</span>
              </label>
              <label className="md:w-2/3 block ">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  onChange={({ target }) => setOnExecute(target.checked)}
                />
                <span className="text-sm">Execution</span>
              </label>
            </div>
            <div className="w-96">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                URL
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                onChange={({ target }) => setUrl(target.value)}
                value={url}
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4"
            onClick={handleAddWebhook}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}

Webhooks.Shell = DashboardShell;

export default Webhooks;
