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
              "text-white": router.pathname === "/flow/[id]",
            })}
            onClick={() =>
              router.push("/flow/[id]", `/flow/${id}`, {
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
              "text-white": router.pathname === "/flow/[id]/history",
            })}
            onClick={() =>
              router.push("/flow/[id]/history", `/flow/${id}/history`, {
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
              "text-white": router.pathname === "/flow/[id]/screenshots",
            })}
            onClick={() =>
              router.push("/flow/[id]/screenshots", `/flow/${id}/screenshots`, {
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
              "text-white": router.pathname === "/flow/[id]/screenshots",
            })}
            onClick={() =>
              router.push("/flow/[id]/screenshots", `/flow/${id}/screenshots`, {
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
