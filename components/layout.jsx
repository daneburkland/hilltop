import React from "react";
import Head from "next/head";

import Header from "./header";
import { UserProvider } from "../lib/user";

const Layout = ({ user, loading = false, children }) => (
  <UserProvider value={{ user, loading }}>
    <Head>
      <title>Hilltop</title>
    </Head>

    <Header />

    <main>
      <div className="container mx-auto">{children}</div>
    </main>

    <style jsx>{``}</style>
    <style jsx global>{`
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, "Segoe UI";
      }
    `}</style>
  </UserProvider>
);

export default Layout;
