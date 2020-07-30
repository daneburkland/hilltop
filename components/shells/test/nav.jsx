import React from "react";
import { useRouter } from "next/router";
import classnames from "classnames";

const Nav = ({ id }) => {
  const router = useRouter();
  return (
    <nav className="text-base text-gray-500 mb-8">
      <ul className="flex">
        <li className="mr-8">
          <a
            className={classnames("cursor-pointer", {
              "text-white": router.pathname === "/test/[id]",
            })}
            onClick={() =>
              router.push("/test/[id]", `/test/${id}`, {
                shallow: true,
              })
            }
          >
            Overview
          </a>
        </li>
        <li className="mr-8">
          <a
            className={classnames("cursor-pointer", {
              "text-white": router.pathname === "/test/[id]/history",
            })}
            onClick={() =>
              router.push("/test/[id]/history", `/test/${id}/history`, {
                shallow: true,
              })
            }
          >
            History
          </a>
        </li>

        <li className="mr-8">
          <a
            className={classnames("cursor-pointer", {
              "text-white": router.pathname === "/test/[id]/screenshots",
            })}
            onClick={() =>
              router.push("/test/[id]/screenshots", `/test/${id}/screenshots`, {
                shallow: true,
              })
            }
          >
            Files
          </a>
        </li>
        <li className="mr-8">
          <a
            className={classnames("cursor-pointer", {
              "text-white": router.pathname === "/test/[id]/screenshots",
            })}
            onClick={() =>
              router.push("/test/[id]/screenshots", `/test/${id}/screenshots`, {
                shallow: true,
              })
            }
          >
            Logs
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
