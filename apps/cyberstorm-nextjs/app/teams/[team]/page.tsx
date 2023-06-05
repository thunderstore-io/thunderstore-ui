"use client";
import { TeamSettingsLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();
  const teamId = router ? router["team"].toString() : "";

  return <TeamSettingsLayout teamId={teamId} />;
}
