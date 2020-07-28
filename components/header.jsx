import React from "react";
import Link from "next/link";
import { useAuth } from "../lib/AuthProvider";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="mb-4 z-10 relative bg-gray-800 text-gray-300">
      <nav className="container mx-auto py-6">
        <ul className="flex">
          <li className="mr-8 text-lg">
            <Link href="/">
              <a>Dashboard</a>
            </Link>
          </li>
          <li className="mr-8 text-lg">
            <Link href="/playground">
              <a>Playground</a>
            </Link>
          </li>
          <li className="mr-8 text-lg">
            <Link href="/run-test">
              <a>New test</a>
            </Link>
          </li>
          {user ? (
            <>
              <li className="mr-8 text-lg">
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
              </li>{" "}
              <li className="mr-8 text-lg">
                <a href="/profile-ssr">Profile (SSR)</a>
              </li>{" "}
              <li className="mr-8 text-lg">
                <a href="/api/logout">Logout</a>
              </li>
            </>
          ) : (
            <>
              <li className="mr-8 text-lg">
                <a href="/api/login">Login</a>
              </li>
            </>
          )}
        </ul>
      </nav>

      <style jsx>{``}</style>
    </header>
  );
};

export default Header;
