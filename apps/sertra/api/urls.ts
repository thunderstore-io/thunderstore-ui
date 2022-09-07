const url = (path: string): string => {
  return `${
    process.env.NEXT_PUBLIC_SERTRA_API_URL ??
    "https://api.servers.thunderstore.dev"
  }${path}`;
};

const tsUrl = (path: string): string => {
  return `${
    process.env.NEXT_PUBLIC_TS_API_URL ?? "https://thunderstore.io"
  }${path}`;
};

export class ApiURLs {
  public static ServerList = url("/api/v1/server/");
  public static ServerCreate = url(`/api/v1/server/create/`);
  public static ServerDetail = (id: string) => url(`/api/v1/server/${id}/`);
}

export class TsApiURLs {
  public static V1Packages = (community: string) =>
    tsUrl(`/c/${community}/api/v1/package/`);
}
