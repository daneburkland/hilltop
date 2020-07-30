import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classnames from "classnames";

const Nav = () => {
  const router = useRouter();
  return (
    <nav className="text-base text-gray-500 mb-8">
      <ul className="flex items-center">
        <li
          className={classnames("mr-8 cursor-pointer", {
            "text-white": router.pathname === "/",
          })}
        >
          <Link href="/">
            <a>Dashboard</a>
          </Link>
        </li>
        <li
          className={classnames("mr-8 cursor-pointer", {
            "text-white": router.pathname === "/profile",
          })}
        >
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </li>
        <li
          className={classnames("mr-8 cursor-pointer", {
            "text-white": router.pathname === "/playground",
          })}
        >
          <Link href="/playground">
            <a>Playground</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
