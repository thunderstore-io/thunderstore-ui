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

export function R(path: string): Resolver<string>;
export function R<Params>(
  path: (params: Params) => string
): (params: Params) => Resolver<string>;
export function R<Children>(
  path: string,
  children: Children
): Children & Resolver<string>;
export function R<Children, Resolution>(
  path: string,
  children: Children,
  resolver: (path: string) => Resolution
): Children & Resolver<Resolution>;
export function R<Params, Children>(
  path: (params: Params) => string,
  children: Children
): (params: Params) => Children & Resolver<string>;
export function R<Params, Children, Resolution>(
  path: (params: Params) => string,
  children: Children,
  resolver: (path: string) => Resolution
): (params: Params) => Children & Resolver<Resolution>;
export function R<Params, Children extends {}, Resolution>(
  path: string | ((params: Params) => string),
  children?: RouteChildren<Children, unknown>,
  resolver?: (path: string) => Resolution
): RouteLeaf<Params, Children, Resolution> {
  if (typeof path !== "string") {
    return (params: Params) => {
      const resolved = path(params);
      return R(resolved, children);
    };
  }

  const _fullPath = (children?._path ?? "") + path;
  const _resolve = resolver ? () => resolver(_fullPath) : () => _fullPath;

  return {
    ...children,
    _path: _fullPath,
    resolve: _resolve,
  };
}
