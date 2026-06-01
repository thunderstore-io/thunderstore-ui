import { NewLink, NewSelectSearch } from "@thunderstore/cyberstorm";

import { FormSection } from "../../commonComponents/FormSection/FormSection";

export interface UploadTeamSectionProps {
  availableTeams: { name: string }[];
  authorName: string;
  onAuthorNameChange: (authorName: string) => void;
}

export function UploadTeamSection({
  availableTeams,
  authorName,
  onAuthorNameChange,
}: UploadTeamSectionProps) {
  return (
    <FormSection
      title="Team"
      description="Select the team you want your package to be associated with."
    >
      <NewSelectSearch
        placeholder="Select team"
        options={availableTeams.map((team) => ({
          value: team.name,
          label: team.name,
        }))}
        onChange={(val) => {
          onAuthorNameChange(val?.value ?? "");
        }}
        value={
          authorName
            ? {
                value: authorName,
                label: authorName,
              }
            : undefined
        }
      />
      <div className="upload__no-teams">
        <p className="upload__no-teams-text">No teams available?</p>
        <NewLink
          key="create-team-link"
          primitiveType="cyberstormLink"
          linkId="Teams"
          csVariant="cyber"
          rootClasses="community__item"
        >
          <span>Create team</span>
        </NewLink>
      </div>
    </FormSection>
  );
}
