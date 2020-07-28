import "../styles.css";
import { ApolloProvider } from "@apollo/react-hooks";
import { useApollo } from "../lib/apolloClient";
import { AuthProvider } from "../lib/AuthProvider";
import "graphiql/graphiql.min.css";

const Noop = ({ children }) => children;

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const Shell = Component.Shell || Noop;

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Shell>
          <Component {...pageProps} />
        </Shell>
      </AuthProvider>
    </ApolloProvider>
  );
}
