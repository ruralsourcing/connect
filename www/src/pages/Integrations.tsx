import { useLocation } from "react-router-dom";
import qs, { ParsedQs } from "qs";
import { gql, useMutation } from "@apollo/client";

interface ZoomQuery extends ParsedQs {
  code?: string;
  state?: string;
}

const PROCESS_CODE = gql`
  mutation addZoomAuth($code: String!, $state: String!) {
    addZoomAuth(code: $code, state: $state) {
      id
      token
      userId
    }
  }
`;

const IntegrationsPage = () => {
  const location = useLocation();
  const [processCode] = useMutation(PROCESS_CODE);
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }) as ZoomQuery;
  console.log(location);
  console.log("[QUERY]", query);
  const { code, state } = query;
  if (code && state) {
    processCode({
      variables: {
        code,
        state,
      },
    }).then((result) => {
      console.log("[CODE RESULT]", result)
    })
  }
  return (
    <>
      <h1>Integrations</h1>
      <button
        onClick={() => {
          const uri = `https://zoom.us/oauth/authorize?response_type=code&client_id=${
            process.env.REACT_APP_ZOOM_CLIENT_ID
          }&redirect_uri=${
            process.env.REACT_APP_ZOOM_REDIRECT_URI
          }&state=${Buffer.from(
            JSON.stringify({
              teamId: 1,
              userId: 1,
            })
          ).toString("base64")}`;
          window.location.href = uri;
        }}
      >
        Authorize Zoom
      </button>
    </>
  );
};

export default IntegrationsPage;
