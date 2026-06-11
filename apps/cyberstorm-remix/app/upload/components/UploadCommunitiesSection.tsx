import { NewSelectSearchMultiple } from "@thunderstore/cyberstorm";

import { FormSection } from "../../commonComponents/FormSection/FormSection";
import type { CommunityOption } from "../uploadUtils";
import { SectionErrors } from "./SectionErrors";

export interface UploadCommunitiesSectionProps {
  communityOptions: CommunityOption[];
  communities: string[];
  sectionErrors: string[];
  onCommunitiesChange: (communities: string[]) => void;
}

export function UploadCommunitiesSection({
  communityOptions,
  communities,
  sectionErrors,
  onCommunitiesChange,
}: UploadCommunitiesSectionProps) {
  return (
    <FormSection
      title="Communities"
      description="Select communities you want your package to be listed under."
    >
      <NewSelectSearchMultiple
        placeholder="Select communities"
        options={communityOptions}
        onChange={(val) => {
          onCommunitiesChange(val ? val.map((c) => c.value) : []);
        }}
        value={communities.map((communityId) => ({
          value: communityId,
          label:
            communityOptions.find((c) => c.value === communityId)?.label || "",
        }))}
      />
      <SectionErrors errors={sectionErrors} />
    </FormSection>
  );
}
