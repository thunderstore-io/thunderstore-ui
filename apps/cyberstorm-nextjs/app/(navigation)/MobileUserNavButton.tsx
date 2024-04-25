"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";

interface Props {
  popoverId: string;
  popoverTargetAction: string;
}

/**
 * This components only purpose is to separate fetching from SSR
 */
export function MobileUserNavButton(props: Props) {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <AvatarButton
      src={avatar}
      username={user.username}
      size="verySmoll"
      popovertarget={props.popoverId}
      popovertargetaction={props.popoverTargetAction}
    />
  );
}

MobileUserNavButton.displayName = "MobileUserNavButton";
