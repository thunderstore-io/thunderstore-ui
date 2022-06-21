const url = (path: string): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export class ApiURLs {
  public static ServerList = url("/api/v1/server/");
  public static ServerCreate = url(`/api/v1/server/create/`);
  public static ServerDetail = (id: string) => url(`/api/v1/server/${id}/`);
}
