import type { AdCampaign } from "../adCampaign";
import { TEST_CAMPAIGN } from "./testCampaign";
import { VALHEIM_LAUNCH } from "./valheimLaunch";

// First match wins.
export const CAMPAIGNS: readonly AdCampaign[] = [VALHEIM_LAUNCH, TEST_CAMPAIGN];
