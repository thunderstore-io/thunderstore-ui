import { Dispatch, SetStateAction } from "react";

export async function sessionFetchLikedPackages(
  session: { sessionid: string; liked_packages: string[] },
  liked,
  setLiked: Dispatch<SetStateAction<boolean>>,
  community: string,
  packageId: string
): Promise<{ success: boolean; message: string }> {
  const payload = JSON.stringify({
    target_state: packageId in session.liked_packages ? false : true,
  });
  const res = await fetch(
    `https://thunderstore.io/c/${community}/api/v1/package/${packageId}/rate/`,
    {
      method: "POST",
      headers: {
        authorization: `Session ${session.sessionid}`,
        "Content-Type": "application/json",
      },
      body: payload,
    }
  );

  return { success: res.status === 200, message: res.statusText };
}

export async function actionPackageRate(
  session: { sessionid: string; liked_packages: string[] },
  liked,
  setLiked: Dispatch<SetStateAction<boolean>>,
  community: string,
  packageId: string
): Promise<{ success: boolean; message: string }> {
  const payload = JSON.stringify({
    target_state: packageId in session.liked_packages ? false : true,
  });
  const res = await fetch(
    `https://thunderstore.io/c/${community}/api/v1/package/${packageId}/rate/`,
    {
      method: "POST",
      headers: {
        authorization: `Session ${session.sessionid}`,
        "Content-Type": "application/json",
      },
      body: payload,
    }
  );
  sessionFetchLikedPackages();

  return { success: res.status === 200, message: res.statusText };
}
