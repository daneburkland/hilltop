import React from "react";
import { useRouter } from "next/router";
import classnames from "classnames";

const Nav = ({ id }) => {
  const router = useRouter();
  console.log(router);
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
            Dashboard
          </a>
        </li>
        <li className="mr-8">
          <a
            className="cursor-pointer"
            onClick={() =>
              router.push("/test/[id]/runs", `/test/${id}/runs`, {
                shallow: true,
              })
            }
          >
            Runs
          </a>
        </li>

        <li className="mr-8">
          <a
            className="cursor-pointer"
            onClick={() =>
              router.push("/test/[id]/screenshots", `/test/${id}/screenshots`, {
                shallow: true,
              })
            }
          >
            Screenshots
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
