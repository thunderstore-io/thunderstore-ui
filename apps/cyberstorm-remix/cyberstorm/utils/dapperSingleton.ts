import { DapperTs } from "@thunderstore/dapper-ts";
import { type RequestConfig } from "@thunderstore/thunderstore-api";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getCachedDapperPromise } from "./dapperRequestCache";

type ConfigFactory = () => RequestConfig;

let currentConfigFactory: ConfigFactory | undefined;
const requestScopedProxies = new WeakMap<Request, DapperTs>();

function resolveConfigFactory(): ConfigFactory {
  if (currentConfigFactory) {
    return currentConfigFactory;
  }

  const tools = getSessionTools();
  currentConfigFactory = () => tools.getConfig();
  return currentConfigFactory;
}

function updateDapperConfig(factory: ConfigFactory) {
  currentConfigFactory = factory;
  if (typeof window !== "undefined" && window.Dapper) {
    window.Dapper.config = () => factory();
  }
}

export function primeClientDapper(factory?: ConfigFactory) {
  if (typeof window === "undefined") {
    return;
  }

  if (factory) {
    updateDapperConfig(factory);
  } else if (!currentConfigFactory) {
    resolveConfigFactory();
  }

  if (!window.Dapper) {
    const resolvedFactory = resolveConfigFactory();
    window.Dapper = new DapperTs(() => resolvedFactory());
  }
}

export function getClientDapper(): DapperTs {
  if (typeof window === "undefined") {
    throw new Error("getClientDapper can only run in the browser");
  }

  if (!window.Dapper) {
    primeClientDapper();
  }

  return window.Dapper;
}

export function getRequestScopedDapper(request?: Request): DapperTs {
  if (!request) {
    return getClientDapper();
  }

  let proxy = requestScopedProxies.get(request);
  if (proxy) {
    return proxy;
  }

  const baseDapper = getClientDapper();
  const handler: ProxyHandler<DapperTs> = {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") {
        return value;
      }

      if (typeof prop !== "string" || !prop.startsWith("get")) {
        return value.bind(target);
      }

      return (...args: unknown[]) =>
        getCachedDapperPromise(
          (...innerArgs: unknown[]) =>
            (value as (...i: unknown[]) => Promise<unknown>).apply(
              target,
              innerArgs
            ),
          args as unknown[],
          request,
          prop
        );
    },
  };

  proxy = new Proxy(baseDapper, handler) as DapperTs;
  requestScopedProxies.set(request, proxy);
  return proxy;
}
