const IntegrationsPage = () => (
  <>
    <h1>Integrations</h1>
    <button onClick={() => {
        const uri = `https://zoom.us/oauth/authorize?response_type=code&client_id=${
            process.env.REACT_APP_ZOOM_CLIENT_ID
          }&redirect_uri=${process.env.REACT_APP_ZOOM_REDIRECT_URI}&state=${Buffer.from(
            JSON.stringify({
              teamId: 1,
              userId: 1,
            })
          ).toString("base64")}`
          window.location.href = uri;
    }}>Authorize Zoom</button>
  </>
);

export default IntegrationsPage;