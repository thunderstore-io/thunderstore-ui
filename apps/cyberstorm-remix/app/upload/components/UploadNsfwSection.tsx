import { NewSwitch } from "@thunderstore/cyberstorm";

import { FormSection } from "../../commonComponents/FormSection/FormSection";

export interface UploadNsfwSectionProps {
  hasNsfwContent: boolean;
  onHasNsfwContentChange: (hasNsfwContent: boolean) => void;
}

export function UploadNsfwSection({
  hasNsfwContent,
  onHasNsfwContentChange,
}: UploadNsfwSectionProps) {
  return (
    <FormSection
      title="Contains NSFW content"
      description='Select if your package contains NSFW material. An "NSFW" -tag will be applied to your package.'
    >
      <div className="upload__nsfw-switch">
        No
        <NewSwitch value={hasNsfwContent} onChange={onHasNsfwContentChange} />
        Yes
      </div>
    </FormSection>
  );
}
