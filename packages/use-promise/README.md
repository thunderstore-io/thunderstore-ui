# use-promise

React hook for resolving promises with Suspense support.

This is based on
[react-promise-suspense](https://github.com/vigzmv/react-promise-suspense)
which isn't really maintained any more, and has one critical flaw: only
the arguments passed to the promise returning function are used to cache
the results. I.e. all functions that are called with same arguments
(e.g. no arguments at all) get the same response from the cache.

The implementation is augmented by storing the original functions name
in the cache and comparing both function name and the arguments. As a
result, only properly named functions are safe to use and others are
rejected straight away.

✅ Works
```
// Function declaration
function a() {
  return Promise(() => 1);
}
usePromise(a, []);

// Variable declaration
const b = function() {
  return Promise(() => 1);
}
usePromise(b, []);

// Arrow function in variable
const c = () => Promise(() => 1);
usePromise(c, []);

// Class/object methods
const dapper = useDapper();
usePromise(dapper.getCommunities, []);
```

❌ No-go
```
// Anonymous function expression
usePromise(function() {}, []);

// Anonymous arrow function
usePromise(() => null, []);

// Function constructor
const d = new Function();
usePromise(d, []);

// Default exported function
import someFunc from "some-lib";
usePromise(someFunc, []);
```

## Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild
