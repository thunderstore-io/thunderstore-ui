import { Heading, SkeletonBox } from "@thunderstore/cyberstorm";

import { Page } from "../../commonComponents/Page/Page";
import "./SubmissionProcessingSkeleton.css";

const SKELETON_ROW_COUNT = 3;

export function SubmissionProcessingSkeleton() {
  return (
    <Page
      rootClasses="submission-processing"
      aria-busy="true"
      aria-label="Processing submission"
    >
      <div className="submission-processing__header">
        <div className="submission-processing__icon">
          <SkeletonBox />
        </div>
        <div className="submission-processing__header-content">
          <div className="submission-processing__title">
            <SkeletonBox />
          </div>
          <div className="submission-processing__description">
            <SkeletonBox />
          </div>
        </div>
      </div>

      <div className="submission-processing__table">
        <div className="submission-processing__table-heading">
          <Heading csLevel="3" csSize="3">
            Processing…
          </Heading>
          <div className="submission-processing__table-subtitle">
            <SkeletonBox />
          </div>
        </div>
        <div className="submission-processing__rows">
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
            <div key={index} className="submission-processing__row">
              <SkeletonBox />
              <SkeletonBox />
              <SkeletonBox />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
