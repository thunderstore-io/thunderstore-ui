type Resolver<Resolution> = {
  _path: string;
  resolve: () => Resolution;
};

type RouteChildren<Children, Resolution> =
  | (Resolver<Resolution> & Children)
  | Resolver<Resolution>;
type RouteLeaf<Params, Children, Resolution> =
  | RouteChildren<Children, Resolution | string>
  | ((params: Params) => RouteChildren<Children, Resolution | string>);

// 1 param variants
export function R(path: string): Resolver<string>;
export function R<Params>(
  path: (params: Params) => string
): (params: Params) => Resolver<string>;

// 2 param variants
export function R<Children>(
  path: string,
  children: Children
): Children & Resolver<string>;
export function R<Params, Children>(
  path: (params: Params) => string,
  children: Children
): (params: Params) => Children & Resolver<string>;
export function R<Resolution>(
  path: string,
  resolver: (path: string) => Resolution
): Resolver<Resolution>;
export function R<Params, Resolution>(
  path: (params: Params) => string,
  resolver: (path: string) => Resolution
): (params: Params) => Resolver<Resolution>;

// 3 param variants
export function R<Children, Resolution>(
  path: string,
  children: Children,
  resolver: (path: string) => Resolution
): Children & Resolver<Resolution>;
export function R<Params, Children, Resolution>(
  path: (params: Params) => string,
  children: Children,
  resolver: (path: string) => Resolution
): (params: Params) => Children & Resolver<Resolution>;
export function R<Children, Resolution>(
  path: string,
  resolver: (path: string) => Resolution,
  children: Children
): Children & Resolver<Resolution>;
export function R<Params, Children, Resolution>(
  path: (params: Params) => string,
  resolver: (path: string) => Resolution,
  children: Children
): (params: Params) => Children & Resolver<Resolution>;

type RArgs<Params, Children, Resolution> = [
  string | ((params: Params) => string),
  ((path: string) => Resolution)?,
  RouteChildren<Children, unknown>?
] &
  [
    string | ((params: Params) => string),
    RouteChildren<Children, unknown>?,
    ((path: string) => Resolution)?
  ];

// Implementation
export function R<Params, Children extends {}, Resolution>(
  ...args: RArgs<Params, Children, Resolution>
): RouteLeaf<Params, Children, Resolution> {
  const [path, arg1, arg2] = args;

  if (typeof path !== "string") {
    return (params: Params) => {
      const resolved = path(params);
      return R(resolved, arg1, arg2);
    };
  }

  let resolver: ((path: string) => Resolution) | undefined = undefined;
  let children: RouteChildren<Children, unknown> | undefined = undefined;

  if (arg1) {
    if (typeof arg1 === "function") {
      resolver = arg1;
    } else {
      children = arg1;
    }
  }

  if (arg2) {
    if (typeof arg2 === "function") {
      resolver = arg2;
    } else {
      children = arg2;
    }
  }

  const _fullPath = (children?._path ?? "") + path;

  let _resolve;
  if (resolver) {
    const asd = resolver;
    _resolve = () => asd(_fullPath);
  } else {
    _resolve = () => _fullPath;
  }

  return {
    ...children,
    _path: _fullPath,
    resolve: _resolve,
  };
}
