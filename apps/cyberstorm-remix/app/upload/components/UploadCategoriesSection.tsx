import { NewSelectSearch } from "@thunderstore/cyberstorm";
import type { PackageSubmissionRequestData } from "@thunderstore/thunderstore-api";

import { FormSection } from "../../commonComponents/FormSection/FormSection";
import type { CategoryOption } from "../uploadUtils";
import { SectionErrors } from "./SectionErrors";

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
      <SectionErrors errors={sectionErrors} />
      {communities.length === 0 ? (
        <p className="upload__category-placeholder">
          Select a community to view available categories
        </p>
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
