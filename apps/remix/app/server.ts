import * as build from "@remix-run/dev/server-build";
import createEventHandler from "./worker-module-handler";

const index = {
  fetch: createEventHandler<Env>({ 
    build,
    getLoadContext: (_, env): LoadContext => ({ env })
  })
};

export default index;
