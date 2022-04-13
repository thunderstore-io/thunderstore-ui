# Dapper the Data Provider

Dapper is a data provider solution which sits between a client and a
source of data. It provides the client with strongly typed functions
which return the data required to e.g. render a specific page. The
client doesn't need to be conserned how and from where the data is
acquired from.

Dapper also defines the interface for this data exchange - new
interchangeable implementations can be written for different
clients and data sources.

## Using Dapper to Fetch Data

For **React**, Dapper offers a *Context Provider* and a custom *hook*.
Using them might look a little something like this:

```JSX
import { PackageCardProps } from "@thunderstore/components";
import { DapperProvider, useDapper} from "@thunderstore/dapper";

const MyApp = () => <DapperProvider apiDomain="https://thunderstore.dev/">
  <CommunityPackageList community="riskofrain2" />
</DapperProvider>

const CommunityPackageList = (props: { community: string }) => {
  const [packages, setPackages] = React.useState<PackageCardProps[]>([]);
  const dapper = useDapper();

  React.useEffect(() => {
    (async () => {
      const data = await dapper.getCommunityPackageListing(props.community);
      setPackages(data.packages);
    })();
  }, []);

  return (
    <ol>
      {packages.map((p) => (
        <li key={p.packageName}>{p.packageName}</li>
      ))}
    </ol>
  );
};
```

**Next.js** relies heavily on `getServerSideProps` function, which can't
call hooks. Instead, we need to instantiate Dapper manually:

```JS
import { Dapper } from "@thunderstore/dapper";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const community = context.params?.community;

  if (!community || Array.isArray(community)) {
    return { notFound: true };
  }

  const dapper = new Dapper("https://thunderstore.dev/");
  const pageProps = await dapper.getCommunityPackageListing(community);

  return {
    props: {
      ...pageProps,
      communityIdentifier: community,
    },
  };
};
```

## Adding New Methods to Dapper

Start by creating a new file for the method under `src/methods`. The
file should contain the following components:

1. A [Zod](https://github.com/colinhacks/zod) *schema*, which describes
   the content expected from the data source, e.g. the API. This is used
   to validate that the received data actually matches the structure and
   typings we expected to receive. Note that the Django backend uses
   snake_case for keys.
2. A TypeScript *interface* that defines the data structure returned by
   the Dapper method. Note that the returned data should use camelCase
   for keys.
3. A TypeScript *interface* for the Dapper method itself. It should
   receive all the parameters required to create the response, which
   should be the interface from step 2, wrapped in a Promise.
4. Optionally, a *transformer function* which receives data matching the
   schema from the step 1 and outputs data matching the interface from
   the step 2. In addition to changing the case of the keys, other
   changes can be done here, but try to keep in mind that a unified
   terminology between different repos is good for developer experience.
5. Define the Dapper method itself using the components defined above.
   For the simplest cases, it's enough to define API path for request
   and the query parameters and to call `queryAndProcess` method (see
   the simple example below).
6. Import the method and its type into `/src/dapper.ts` and add it to
   the interface and the class.

```JS
// GetNotifications is the interface from step 3.
export const getNotifications: GetNotifications = async function (
  this: Dapper
  userId,
  includeOldNotifications
) {
  const apiPath = "users/notifications/";

  // See src/queryString.ts for more info.
  const queryString = serializeQueryString([
    { key: "user", value: userId },
    { key: "showOld", value: includeOldNotifications, impotent: false },
  ]);

  // this.queryAndProcess is defined in the Dapper class.
  return await this.queryAndProcess(
    apiPath,
    queryParams,
    schema, // The Zod schema created in step 1.
    transform // The transformer function from step 4.
  );
};
```
