type State = {
  _path: string;
};

type Resolver<Resolution> = {
  resolve: () => Resolution;
};

export function R(path: string): Resolver<string> & State;
export function R<Params>(
  path: (params: Params) => string
): (params: Params) => Resolver<string> & State;
export function R<Children>(
  path: string,
  children: Children
): Children & Resolver<string> & State;
export function R<Params, Children>(
  path: (params: Params) => string,
  children: Children
): (params: Params) => Children & Resolver<string> & State;
export function R<Resolution>(
  path: string,
  children: undefined,
  resolver: (path: string) => Resolution
): Resolver<Resolution> & State;
export function R<Params, Children extends {}, Resolution>(
  path: string | ((params: Params) => string),
  children?: Children & State,
  resolver?: (path: string) => Resolution
):
  | (
      | (Children & Resolver<Resolution | string> & State)
      | (Resolver<Resolution | string> & State)
    )
  | ((
      params: Params
    ) =>
      | (Children & Resolver<Resolution | string> & State)
      | (Resolver<Resolution | string> & State)) {
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
