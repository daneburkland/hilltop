import auth0 from "../../lib/auth0";
const callAPI = async (path, body, headers) => {
  const res = await fetch("http://localhost:4000", {
    method: "post",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
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
export default async function graph(req, res) {
  try {
    const tokenCache = await auth0.tokenCache(req, res);
    const result = await tokenCache.getAccessToken();

    const { accessToken } = result;
    const apiRes = await callAPI("graphql", req.body, {
      authorization: `Bearer ${accessToken}`,
    });
    forwardResponse(res, apiRes);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
