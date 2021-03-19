import { useLocation } from "react-router-dom";
import qs, { ParsedQs } from "qs";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

interface ZoomQuery extends ParsedQs {
  code?: string;
  state?: string;
}

const GET_TOKEN = gql`
  {
    user {
      zoom {
        id
        token
        userId
      }
    }
  }
`;

const PROCESS_CODE = gql`
  mutation addZoomAuth($code: String!, $state: String!) {
    addZoomAuth(zoomAuth: { code: $code, state: $state }) {
      id
      token
      userId
    }
  }
`;

const START_MEETING = gql`
  mutation startMeeting {
    startMeeting {
      uuid
      start_url
      join_url
      password
      host_id
      host_email
      userId
    }
  }
`;

const IntegrationsPage = () => {
  const [startUrl, setStartUrl] = useState();
  const [joinUrl, setJoinUrl] = useState();
  const location = useLocation();
  const [startMeeting] = useMutation(START_MEETING);
  const { loading, error, data, refetch } = useQuery(GET_TOKEN);
  const [processCode] = useMutation(PROCESS_CODE);

  useEffect(() => {
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    }) as ZoomQuery;
    console.log(location);
    console.log("[QUERY]", query);
    const { code, state } = query;
    if (code && state) {
      window.history.pushState(
        null,
        "",
        `${window.location.protocol}//${window.location.host}`
      );
      processCode({
        variables: {
          code,
          state,
        },
      }).then((result) => {
        console.log("[CODE RESULT]", result);
        refetch();
      });
    }
  }, [location, processCode, refetch]);

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! ${error.message}`</div>) ||
    (data && data.user?.zoom?.token && (
      <>
        <div>Authorized</div>
        <button
          type="button"
          onClick={() => {
            startMeeting().then((result) => {
              console.info("[MEETING INFO]", result);
              setStartUrl(result.data?.startMeeting?.start_url);
              setJoinUrl(result.data?.startMeeting?.join_url);
            });
          }}
        >
          Start Meeting
        </button>
        {startUrl && <a href={startUrl}>Start Meeting</a>}
        {joinUrl && <a href={joinUrl}>Join Meeting</a>}
      </>
    )) || (
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
    )
  );
};

export default IntegrationsPage;
