const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/graphql",
    createProxyMiddleware({
      target: "http://server:3000",
      changeOrigin: true,
    })
  );

  app.use(
    "/users",
    createProxyMiddleware({
      target: "http://server:3000",
      changeOrigin: true,
    })
  );
};
