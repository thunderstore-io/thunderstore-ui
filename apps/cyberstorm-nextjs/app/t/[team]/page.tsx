"use client";
import { TeamLayout } from "@thunderstore/cyberstorm";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();
  const teamId = router ? router["team"].toString() : "";

  return <TeamLayout teamId={teamId} />;
}
