import { UserProfileLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { user: string } }) {
  return <UserProfileLayout userId={params.user} />;
}
