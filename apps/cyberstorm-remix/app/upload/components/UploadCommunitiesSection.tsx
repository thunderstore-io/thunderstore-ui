import { NewAlert, NewSelectSearch } from "@thunderstore/cyberstorm";

import { FormSection } from "../../commonComponents/FormSection/FormSection";

export interface CommunityOption {
  value: string;
  label: string;
}

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
      <NewSelectSearch
        placeholder="Select communities"
        multiple
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
      {sectionErrors.length > 0 ? (
        <NewAlert csVariant="danger" rootClasses="upload__alert">
          <ul>
            {sectionErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </NewAlert>
      ) : null}
    </FormSection>
  );
}
