import moduleJSON from "__STATIC_CONTENT_MANIFEST";
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
  type Options as KvAssetHandlerOptions,
} from "@cloudflare/kv-asset-handler";
import {
  type AppLoadContext,
  createRequestHandler as createRemixRequestHandler,
  type ServerBuild,
} from "@remix-run/cloudflare";

type AssetManifest = Omit<KvAssetHandlerOptions["ASSET_MANIFEST"], string>;
type KvAssetHandlerEvent = Parameters<typeof getAssetFromKV>[0];
type WaitUntilCallback = KvAssetHandlerEvent["waitUntil"];
interface StaticContentEnvironment { __STATIC_CONTENT: KVNamespace<string> }

const module = JSON.parse(moduleJSON) as AssetManifest;

/**
 * A function that returns the value to use as `context` in route `loader` and
 * `action` functions.
 *
 * You can think of this as an escape hatch that allows you to pass
 * environment/platform-specific values through to your loader/action.
 */
type GetLoadContextFunction<Environment = unknown> = (
  request: Request,
  environment: Environment,
  context: ExecutionContext
) => AppLoadContext;

/**
 * Returns a request handler for the Cloudflare runtime that serves the
 * Remix SSR response.
 */
const createRequestHandler = <Environment extends StaticContentEnvironment = StaticContentEnvironment>({
  build,
  getLoadContext,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Environment>;
  mode?: string;
}) => {
  const handleRequest = createRemixRequestHandler(build, mode);

  return (request: Request, environment: Environment, context: ExecutionContext) => {
    const loadContext = getLoadContext?.(request, environment, context);

    return handleRequest(request, loadContext);
  };
};

const handleAsset = async (
  request: Request,
  waitUntil: WaitUntilCallback,
  assetNamespace: KVNamespace<string>,
  build: ServerBuild,
  options?: Partial<KvAssetHandlerOptions>
) => {
  try {
    const mergedOptions = {
      ASSET_NAMESPACE: assetNamespace,
      ASSET_MANIFEST: module,
      ...options,
    };

    if (process.env.NODE_ENV === "development") {
      return await getAssetFromKV(
        { request, waitUntil },
        {
          cacheControl: {
            bypassCache: true,
          },
          ...mergedOptions,
        }
      );
    }

    let cacheControl = {};
    const url = new URL(request.url);
    const assetpath = build.assets.url.split("/").slice(0, -1).join("/");
    const requestpath = url.pathname.split("/").slice(0, -1).join("/");

    if (requestpath.startsWith(assetpath)) {
      // Assets are hashed by Remix so are safe to cache in the browser
      // And they're also hashed in KV storage, so are safe to cache on the edge
      cacheControl = {
        bypassCache: false,
        edgeTTL: 31_536_000,
        browserTTL: 31_536_000,
      };
    } else {
      // Assets are not necessarily hashed in the request URL, so we cannot cache in the browser
      // But they are hashed in KV storage, so we can cache on the edge
      cacheControl = {
        bypassCache: false,
        edgeTTL: 31_536_000,
      };
    }

    return await getAssetFromKV(
      { request, waitUntil },
      {
        cacheControl,
        ...mergedOptions,
      }
    );
  } catch (error) {
    if (error instanceof MethodNotAllowedError || error instanceof NotFoundError) {
      return null;
    }

    throw error;
  }
};

const createEventHandler = <Environment extends StaticContentEnvironment = StaticContentEnvironment>({
  build,
  getLoadContext,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Environment>;
  mode?: string;
}): ExportedHandlerFetchHandler<Environment> => {
  const handleRequest = createRequestHandler({
    build,
    getLoadContext,
    mode,
  });

  const handleEvent = async (
    request: Request,
    environment: Environment & StaticContentEnvironment,
    context: ExecutionContext
  ) => {
    let response = await handleAsset(request, context.waitUntil.bind(context), environment.__STATIC_CONTENT, build);

    if (!response) {
      response = await handleRequest(request, environment, context);
    }

    return response;
  };

  return (
    request: Request,
    environment: Environment & { __STATIC_CONTENT: KVNamespace<string> },
    context: ExecutionContext
  ) => {
    try {
      return handleEvent(request, environment, context);
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development" && error instanceof Error) {
        return new Response(error.message, {
          status: 500,
        });
      }

      return new Response("Internal Error", { status: 500 });
    }
  };
};

export default createEventHandler;
