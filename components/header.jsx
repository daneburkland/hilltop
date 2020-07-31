import React from "react";
import Link from "next/link";
import { useAuth } from "../lib/AuthProvider";
import classnames from "classnames";

function Gravitar({ gravitar }) {
  return (
    <li className="mr-4 cursor-pointer">
      <Link href="/">
        <img className="rounded-full" width={50} height={50} src={gravitar} />
      </Link>
    </li>
  );
}

function Breadcrumbs({ breadcrumbs = [], gravitar }) {
  const length = breadcrumbs.length;
  if (!length) {
    return (
      <>
        <Gravitar gravitar={gravitar} />
        <li className="mr-8 text-lg flex-grow text-white">
          <Link href="/">
            <a>{(breadcrumbs[0] && breadcrumbs[0].label) || "Loading..."}</a>
          </Link>
        </li>
      </>
    );
  }

  return (
    <div className="flex flex-grow items-center">
      <Gravitar gravitar={gravitar} />
      {breadcrumbs.map((breadcrumb, i) => (
        <>
          {!!i && (
            <svg
              className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
          <li
            className={classnames("text-lg", {
              "text-white": i === length - 1,
            })}
          >
            <Link href={breadcrumb.href}>
              <a>{breadcrumb.label}</a>
            </Link>
          </li>
        </>
      ))}
    </div>
  );
}

const Header = ({ breadcrumbs, gravitar }) => {
  const { user: authedUser } = useAuth();

  return (
    <header className="z-10 relative bg-gray-800 text-gray-500">
      <nav className="container mx-auto py-4">
        <ul className="flex items-center">
          <Breadcrumbs breadcrumbs={breadcrumbs} gravitar={gravitar} />
          <li className="mr-8 text-lg">
            <Link href="/newFlow">
              <a>New flow</a>
            </Link>
          </li>
          {authedUser ? (
            <>
              <li className="mr-8 text-lg">
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
              </li>
              <li className="text-lg">
                <a href="/api/logout">Logout</a>
              </li>
            </>
          ) : (
            <>
              <li className="text-lg">
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
