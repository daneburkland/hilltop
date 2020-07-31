import FlowShell, { FlowContext } from "../../../../components/shells/flow";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";
import { formatRelative } from "date-fns";

const GET_FLOW_RUNS = gql`
  query flowRuns($id: Int!) {
    flowRuns(id: $id, orderBy: { createdAt: "desc" }) {
      id
      screenshotUrls
      createdAt
    }
  }
`;

function FlowRunRow({ flowRun }) {
  const router = useRouter();
  const { id } = router.query;
  const previewSrc =
    flowRun.screenshotUrls[0] || "https://via.placeholder.com/150";
  return (
    <Link key={flowRun.id} href={`/flow/${id}/history/${flowRun.id}`}>
      <div className="flex items-center p-3 cursor-pointer hover:bg-gray-200">
        <img src={previewSrc} className="w-2/12 h-32" />
        <div className="text-2xl font-semibold w-5/12 ml-8">{"flow.title"}</div>
        <div className="w-5/12 text-gray-700 flex flex-col">
          <span className="text-gray-600">
            {formatRelative(new Date(flowRun.createdAt), new Date())}
          </span>
        </div>
      </div>
    </Link>
  );
}

const History = () => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_FLOW_RUNS, {
    variables: { id: parseInt(id) },
  });
  return (
    <div className="bg-white rounded overflow-hidden shadow-lg p-8 mb-10 w-full">
      {loading
        ? "Loading..."
        : data.flowRuns.map((flowRun) => <FlowRunRow flowRun={flowRun} />)}
    </div>
  );
};

History.Shell = FlowShell;

export default History;
