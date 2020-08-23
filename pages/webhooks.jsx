import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DashboardShell from "../components/shells/dashboard";
import { DotsVerticalOutline } from "heroicons-react";
import Popover from "../components/Popover";

const CREATE_WEBHOOK = gql`
  mutation createWebhook($noun: String!, $verb: String!, $url: String!) {
    createWebhook(noun: $noun, verb: $verb, url: $url) {
      id
      url
      event {
        noun
        verb
      }
    }
  }
`;

const DELETE_WEBHOOK = gql`
  mutation deleteWebhook($id: Int!) {
    deleteWebhook(id: $id) {
      id
    }
  }
`;

const GET_WEBHOOKS = gql`
  query webhooks {
    webhooks {
      id
      url
      event {
        noun
        verb
      }
    }
  }
`;

function Webhooks() {
  const [noun, setNoun] = useState("Flow");
  const [verb, setVerb] = useState("executed");
  const [webhooks, setWebhooks] = useState([]);
  const [url, setUrl] = useState(null);
  const { data } = useQuery(GET_WEBHOOKS, {
    onCompleted: ({ webhooks }) => setWebhooks(webhooks),
  });

  const [targetedWebhookId, setTargetedWebhookId] = useState(null);

  const [handleAddWebhook] = useMutation(CREATE_WEBHOOK, {
    variables: { noun, verb, url },
    onCompleted: ({ createWebhook: newWebhook }) => {
      setWebhooks([...webhooks, newWebhook]);
      setUrl(null);
    },
  });

  const [deleteWebhook] = useMutation(DELETE_WEBHOOK, {
    onCompleted: ({ deleteWebhook }) => {
      setWebhooks(
        webhooks.filter((webhook) => webhook.id !== deleteWebhook.id)
      );
      setTargetedWebhookId(null);
    },
  });
  return (
    <>
      <h1 className="text-4xl font-semibold mb-4">Webhooks</h1>

      <div className="mb-4">
        <div className="mb-8">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="mb-3 flex">
              <div className="flex items-baseline flex-grow">
                <code className="bg-gray-100 text-gray-800 px-1 py-1 mr-2">{`${webhook.event.noun.toLowerCase()}.${
                  webhook.event.verb
                }`}</code>
                <span className="mr-2 whitespace-no-wrap">
                  events are notifying
                </span>
                <div className="truncate mr-4">
                  <code
                    className="mr-2 bg-gray-100 text-gray-800 px-1 py-1
                "
                  >
                    {webhook.url}
                  </code>
                </div>
              </div>
              <Popover
                isOpen={targetedWebhookId === webhook.id}
                close={() => setTargetedWebhookId(null)}
                content={
                  <ul>
                    <li
                      className="cursor-pointer"
                      onClick={() =>
                        deleteWebhook({ variables: { id: webhook.id } })
                      }
                    >
                      Delete
                    </li>
                  </ul>
                }
              >
                <DotsVerticalOutline
                  className="cursor-pointer"
                  onClick={() => setTargetedWebhookId(webhook.id)}
                />
              </Popover>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-3">Add new webhook</h2>
        <div className="w-full flex justify-between items-end mb-6">
          <div className="flex flex-grow items-end">
            {/* <div className="mr-4 w-64">
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
                  value={noun}
                  onChange={({ target }) => {
                    setNoun(target.value);
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
            </div> */}
            <div className="mr-2 w-36">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Event
              </label>
              <label className="block ">
                <input
                  type="radio"
                  className="mr-2 leading-tight"
                  checked={verb === "errored"}
                  value="errored"
                  onChange={({ target }) => setVerb(target.value)}
                />
                <span className="text-sm">Errored</span>
              </label>
              <label className="block ">
                <input
                  type="radio"
                  className="mr-2 leading-tight"
                  checked={verb === "executed"}
                  value="executed"
                  onChange={({ target }) => setVerb(target.value)}
                />
                <span className="text-sm">Executed</span>
              </label>
            </div>
            <div className="flex-grow mr-10">
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
            className="bg-transparent hover:bg-blue-500 text-blue-700 text-sm font-semibold hover:text-white py-3 px-4 border border-blue-500 hover:border-transparent rounded"
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
