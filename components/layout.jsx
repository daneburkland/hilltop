import React from "react";
import Head from "next/head";
import Header from "./header";
import { useAuth } from "../lib/AuthProvider";
import gql from "graphql-tag";

const Layout = ({ children, breadcrumbs, gravitar }) => {
  const { hasLoadedUser, user } = useAuth();
  return (
    <>
      <Head>
        <title>{(breadcrumbs && breadcrumbs[0].label) || "Hilltop"}</title>
      </Head>
      <Header breadcrumbs={breadcrumbs} gravitar={user?.picture} />
      <hr className="container mx-auto mb-4 border-gray-500" />
      <main>
        <div className="container mx-auto">
          <div
            className="absolute bg-gray-800 z-0 w-full"
            style={{
              height: 200,
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
          {hasLoadedUser ? children : "Loading..."}
        </div>
      </main>
      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, "Segoe UI";
        }
      `}</style>
    </>
  );
};

export default Layout;
