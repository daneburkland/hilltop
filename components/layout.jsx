import React from "react";
import Head from "next/head";
import Header from "./header";
import { useAuth } from "../lib/AuthProvider";

const Layout = ({ children }) => {
  const { hasLoadedUser } = useAuth();
  return (
    <>
      <Head>
        <title>Hilltop</title>
      </Head>

      <Header />

      <main>
        <div className="container mx-auto">
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
