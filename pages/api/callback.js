import auth0 from "../../lib/auth0";
import gql from "graphql-tag";

const LOGIN = gql`
  mutation login($name: String!, $email: String!) {
    login(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const callAPI = async (path, body, session, headers) => {
  const res = await fetch("http://localhost:4000", {
    method: "post",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      operationName: "login",
      query: LOGIN,
      variables: {
        name: session.user.name,
        email: session.user.email,
      },
    }),
  });
  return {
    body: await res.text(),
    status: res.status,
    headers: res.headers,
  };
};
const forwardHeader = (res, apiRes, header) => {
  if (apiRes.headers.get(header)) {
    res.setHeader(header, apiRes.headers.get(header));
  }
};
const forwardResponse = (res, apiRes) => {
  forwardHeader(res, apiRes, "content-type");
  forwardHeader(res, apiRes, "www-authenticate");
  res.status(apiRes.status);
  res.send(apiRes.body);
};

export default async function callback(req, res) {
  try {
    await auth0.handleCallback(req, res, {
      onUserLoaded: async (req, res, session) => {
        try {
          const response = await callAPI("graphql", req.body, session, {
            authorization: `Bearer ${session.accessToken}`,
          });
          console.log("response", response);
        } catch (e) {
          console.log(e);
        }
        return session;
      },
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
