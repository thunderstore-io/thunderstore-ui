// This only works on client side components. For server side stuff
// see https://nextjs.org/docs/app/api-reference/functions/cookies
export const getCookie = (name: string) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const allCookies = new URLSearchParams(
    window.document.cookie.replaceAll("&", "%26").replaceAll("; ", "&")
  );
  const cookie = allCookies.get(name);
  return cookie === null ? undefined : cookie;
};
