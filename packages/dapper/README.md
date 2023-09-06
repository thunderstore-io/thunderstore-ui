# Dapper the Data Provider

Dapper is a data provider solution which sits between a client and a
source of data. It provides the client with strongly typed functions
which return the data required to e.g. render a specific page. The
client doesn't need to be conserned how and from where the data is
acquired from.

Dapper defines the interface for this data exchange - new
interchangeable implementations can be written for different
clients and data sources.

## Using Dapper to Fetch Data

For **React**, Dapper offers a *Context Provider* and a custom *hook*.
Using them might look a little something like this:

```JSX
import React from "react";
import usePromise from "react-promise-suspense";

import { DapperProvider, useDapper} from "@thunderstore/dapper";
import { Communities } from "@thunderstore/dapper/types";

const MyApp = () => <DapperProvider apiDomain="https://thunderstore.dev/">
  <CommunityList />
</DapperProvider>

const CommunityList = () => {
  const dapper = useDapper();

  // React-hook based approach.
  const [firstPage, setFirstPage] = React.useState<Communities>();

  React.useEffect(() => {
    (async () => {
      const pageNumber = 1;
      const data = await dapper.getCommunities(pageNumber);
      setFirstPage(data.results);
    })();
  }, []);

  // Alternative approach to support suspenses.
  const pageNumber = 2;
  const secondPage = usePromise(dapper.getCommunities, [pageNumber]);

  return (
    <>
      <ol>
        {firstPage.map((c) => (
          <li key={c.identifier}>{c.name}</li>
        ))}
        {secondPage.map((c) => (
          <li key={c.identifier}>{c.name}</li>
        ))}
      </ol>
    </>
  );
};
```

## Adding New Methods to Dapper

1. Define method's type signature in `src/types/methods.ts`
    * Note that the naming convention of the returned data is to match
      the naming used in Thunderstore backend to help developers grasp
      how the data maps between the systems
    * Note that everything exported from `src/types/index.ts` can be´
      imported by other packages from `@thunderstore/dapper/types`
2. Add the method in DapperInterface (`src/dapper.ts`)
3. Add the method implementation to the current Dapper implementations,
   e.g. `dapper-fake` and `dapper-ts`
    * Note that the implementations are responsible for verifying the
      returned data matches in the interface
