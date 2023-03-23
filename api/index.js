"/ Create a proxy to redirect requests of the "/api/*" path to the web http
// Examples:
// GET /api/v1/posts/all?format=json → https://api.pinboard.in/v1/posts/all?format=json
import { createProxyMiddleware } from 'http-proxy-middleware';
import NextCors  from 'nextjs-cors';

const apiProxy = createProxyMiddleware({
  target: "https://1fichier.com/?rh3ul10p70mgwfsw33if",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "" // Strip "/api" from the URL 
  },
  onProxyRes(proxyRes) {
    proxyRes.headers["access-control-allow-origin"] = "*", 
    proxyRes.headers["access-control-allow-methods"] = "DELETE, POST, GET, OPTIONS, PUT, PATCH",
    proxyRes.headers["access-control-allow-headers"] = "Origin, X-Requested-With, Content-Type, Accept" 
  }
});

// In Vercel, any file inside the "api" directory is mapped to "/api" and
// will be treated as an API endpoint.
// By default, on Vercel this "/api" endpoint would strictly match only "/api" 
// requestes (ignoring sub-paths like "/api/hello"). So, to proxy the entire 
// path, we add a rewrite in "vercel.json" to allow the "api" directory to catch
// all "/api/*" requests.
export default async function (req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });
  // Proxy "/api/*" requests to the pinboard API.
  return apiProxy(req, res);
};


