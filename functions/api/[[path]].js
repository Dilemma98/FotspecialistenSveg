
const API_URL = "https://fotspecialisten-api.emma-hogdal.workers.dev";

// Forward API requests to the Cloudflare Worker.
export async function onRequest(context) {
  const url = new URL(context.request.url);

  const workerUrl = new URL(
    url.pathname + url.search,
    API_URL
  );

  const response = await fetch(workerUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,
  });

  return response;
}
