import { NewAlert, NewSelectSearch } from "@thunderstore/cyberstorm";
import type { PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";

import { FormSection } from "../../commonComponents/FormSection/FormSection";

export interface CategoryOption {
  value: string;
  label: string;
}

export interface UploadCategoriesSectionProps {
  communities: string[];
  communityCategories: PackageSubmissionRequestData["community_categories"];
  categoryOptions: { communityId: string; categories: CategoryOption[] }[];
  communityResults: { identifier: string; name: string }[];
  sectionErrors: string[];
  onCommunityCategoriesChange: (
    communityCategories: PackageSubmissionRequestData["community_categories"]
  ) => void;
}

export function UploadCategoriesSection({
  communities,
  communityCategories,
  categoryOptions,
  communityResults,
  sectionErrors,
  onCommunityCategoriesChange,
}: UploadCategoriesSectionProps) {
  return (
    <FormSection
      title="Categories"
      description="Select descriptive categories to help people discover your package."
    >
      {sectionErrors.length > 0 ? (
        <NewAlert csVariant="danger" rootClasses="upload__alert">
          <ul>
            {sectionErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </NewAlert>
      ) : null}
      {communities.map((community) => {
        const communityData = communityResults.find(
          (c) => c.identifier === community
        );
        const categories =
          categoryOptions.find((c) => c.communityId === community)
            ?.categories || [];

        return (
          <div key={community} className="upload__category">
            <p className="upload__category-label">{communityData?.name}</p>
            <NewSelectSearch
              placeholder="Select categories"
              multiple
              options={categories}
              onChange={(val) => {
                if (val) {
                  onCommunityCategoriesChange({
                    ...communityCategories,
                    [community]: val.map((v) => v.value),
                  });
                } else if (communityCategories?.[community]) {
                  const next = { ...communityCategories };
                  delete next[community];
                  onCommunityCategoriesChange(next);
                }
              }}
              value={
                communityCategories?.[community]?.map((categoryId) => ({
                  value: categoryId,
                  label:
                    categories.find((c) => c.value === categoryId)?.label || "",
                })) ?? []
              }
            />
          </div>
        );
      })}
    </FormSection>
  );
}
