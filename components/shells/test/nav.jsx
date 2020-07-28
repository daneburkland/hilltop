import React from "react";
import { useRouter } from "next/router";

const Nav = ({ id }) => {
  const router = useRouter();
  return (
    <nav className="text-white mb-4">
      <ul className="flex">
        <li className="mr-8 text-lg">
          <a
            className="cursor-pointer"
            onClick={() =>
              router.push("/test/[id]", `/test/${id}`, {
                shallow: true,
              })
            }
          >
            Dashboard
          </a>
        </li>

        <li className="mr-8 text-lg">
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
