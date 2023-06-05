"use client";
import { useParams } from "next/navigation";
import { TeamLayout } from "@thunderstore/cyberstorm";

export default function Page() {
  const router = useParams();
  const teamId = router ? router["team"].toString() : "";

  return <TeamLayout teamId={teamId} />;
}
