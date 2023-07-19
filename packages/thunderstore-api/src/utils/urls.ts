type Resolver = {
  _path: string;
  resolve: () => string;
};

export function R(path: string): Resolver;
export function R<Params>(
  path: (params: Params) => string
): (params: Params) => Resolver;
export function R<Children>(
  path: string,
  children: Children
): Children & Resolver;
export function R<Params, Children>(
  path: (params: Params) => string,
  children: Children
): (params: Params) => Children & Resolver;
export function R<Params, Children extends {}>(
  path: string | ((params: Params) => string),
  children?: Children & Resolver
):
  | ((Children & Resolver) | Resolver)
  | ((params: Params) => (Children & Resolver) | Resolver) {
  if (typeof path !== "string") {
    return (params: Params) => {
      const resolved = path(params);
      return R(resolved, children);
    };
  }
  const _resolved = (children?._path ?? "") + path;

  let result: (Children & Resolver) | Resolver;
  if (children) {
    children.resolve = () => _resolved;
    children._path = _resolved;
    result = children;
  } else {
    result = {
      _path: _resolved,
      resolve: () => _resolved,
    };
  }
  return result;
}
