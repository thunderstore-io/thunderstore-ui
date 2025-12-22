import { DapperTs } from "@thunderstore/dapper-ts";
import { type RequestConfig } from "@thunderstore/thunderstore-api";

import { getSessionTools } from "../security/publicEnvVariables";
import { deduplicatePromiseForRequest } from "./requestCache";

type ConfigFactory = () => RequestConfig;

let currentConfigFactory: ConfigFactory | undefined;
let requestScopedProxies = new WeakMap<Request, DapperTs>();

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
    window.Dapper.config = factory;
  }
}

export function initializeClientDapper(factory?: ConfigFactory) {
  if (typeof window === "undefined") {
    return;
  }

  if (factory) {
    updateDapperConfig(factory);
  }

  if (!window.Dapper) {
    const resolvedFactory = resolveConfigFactory();
    window.Dapper = new DapperTs(resolvedFactory);
  }
}

export function getClientDapper(): DapperTs {
  if (typeof window === "undefined") {
    throw new Error("getClientDapper can only run in the browser");
  }

  if (!window.Dapper) {
    initializeClientDapper();
  }

  return window.Dapper;
}

/**
 * Returns a Dapper instance scoped to the request.
 * If a request is provided, it returns a proxy that deduplicates "get" requests.
 * If no request is provided (e.g. client-side navigation), it returns the global client Dapper instance.
 *
 * @param request - The Request object to scope the Dapper instance to.
 */
export function getDapperForRequest(request?: Request): DapperTs {
  if (!request) {
    return getClientDapper();
  }

  let proxy = requestScopedProxies.get(request);
  if (proxy) {
    return proxy;
  }

  const baseDapper = getClientDapper();
  const handler: ProxyHandler<DapperTs> = {
    get(target, propertyName, receiver) {
      const value = Reflect.get(target, propertyName, receiver);
      if (typeof value !== "function") {
        return value;
      }

      // We only cache methods starting with "get" to avoid caching mutations or other side effects.
      if (typeof propertyName !== "string" || !propertyName.startsWith("get")) {
        return value.bind(target);
      }

      return (...args: unknown[]) =>
        deduplicatePromiseForRequest(
          propertyName,
          (...innerArgs: unknown[]) =>
            (value as (...i: unknown[]) => Promise<unknown>).apply(
              target,
              innerArgs
            ),
          args as unknown[],
          request
        );
    },
  };

  proxy = new Proxy(baseDapper, handler) as DapperTs;
  requestScopedProxies.set(request, proxy);
  return proxy;
}

export function resetDapperSingletonForTest() {
  currentConfigFactory = undefined;
  requestScopedProxies = new WeakMap<Request, DapperTs>();
}
