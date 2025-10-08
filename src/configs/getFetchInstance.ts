import { API_BASE_URL } from "@/configs";

interface GetFetchInstanceProps {
  url: string;
  cache?: boolean;
  config?: RequestInit;
}

type Interceptor = (
  input: RequestInfo,
  init?: RequestInit,
) => Promise<[RequestInfo, RequestInit?]>;
type ResponseInterceptor = (response: Response) => Promise<Response>;

const requestInterceptors: Interceptor[] = [];

const responseInterceptors: ResponseInterceptor[] = [];

export const addRequestInterceptor = (interceptor: Interceptor) => {
  requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor: ResponseInterceptor) => {
  responseInterceptors.push(interceptor);
};

// main fetch wrapper
export const getFetchInstance = async <T>({
  url,
  cache = true,
  config = {},
}: GetFetchInstanceProps): Promise<T> => {
  let request: [RequestInfo, RequestInit?] = [
    API_BASE_URL + url,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(config?.headers || {}),
      },
      cache: cache ? "default" : "no-cache",
      ...config,
    },
  ];

  for (const interceptor of requestInterceptors) {
    request = await interceptor(...request);
  }

  let response = await fetch(...request);

  for (const interceptor of responseInterceptors) {
    response = await interceptor(response);
  }

  const text = await response.text();

try {
  return JSON.parse(text) as T;
} catch (error) {
  console.error("❌ Failed to parse JSON. Server returned:", text);
  throw new Error("Invalid JSON response from server");
}
};

// addResponseInterceptor(async (response) => {
//   if (typeof window !== "undefined") {
//     if (
//       response.status === 503 &&
//       !window.location.pathname.startsWith("/maintenance")
//     ) {
//       document.cookie = "maintenance=true; path=/";
//       window.location.href = "/maintenance";
//     }
//   }

//   return response;
// });
