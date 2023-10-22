export const UsermediaUrls = {
  init: "/api/experimental/usermedia/initiate-upload/",
  abort: (uuid: string) => `/api/experimental/usermedia/${uuid}/abort-upload/`,
  finish: (uuid: string) =>
    `/api/experimental/usermedia/${uuid}/finish-upload/`,
};
