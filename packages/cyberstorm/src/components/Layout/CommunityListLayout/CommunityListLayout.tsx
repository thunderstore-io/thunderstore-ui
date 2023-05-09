import { useState } from "react";
import styles from "./CommunityListLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { CommunitiesLink } from "../../Links/Links";
import { TextInput } from "../../TextInput/TextInput";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { Select } from "../../Select/Select";
import { Title } from "../../Title/Title";
import { getCommunityPreviewDummyData, getListOfIds } from "../../../dummyData";
import { CommunityPreview } from "../../../schema";
import { BaseLayout } from "../BaseLayout/BaseLayout";

/**
 * Cyberstorm CommunityList Layout
 */
export function CommunityListLayout() {
  const [order, setOrder] = useState("1");

  const communitiesData: CommunityPreview[] = getCommunityData();

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
        </BreadCrumbs>
      }
      header={<Title text="Communities" />}
      search={
        <div className={styles.filters}>
          <TextInput
            placeHolder="Search communities..."
            leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
          />
          <Select onChange={setOrder} options={selectOptions} value={order} />
        </div>
      }
      mainContent={
        <div className={styles.communityCardList}>
          {communitiesData.map((community) => {
            return (
              <CommunityCard key={community.name} communityData={community} />
            );
          })}
        </div>
      }
    />
  );
}

CommunityListLayout.displayName = "CommunityListLayout";
CommunityListLayout.defaultProps = {};

function getCommunityData() {
  return getListOfIds(20).map((communityId) => {
    return getCommunityPreviewDummyData(communityId);
  });
}

const selectOptions = [
  {
    value: "1",
    label: "Newest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faStar} />,
  },
  {
    value: "2",
    label: "Hottest",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faFire} />,
  },
  {
    value: "3",
    label: "Top rated",
    leftIcon: <FontAwesomeIcon fixedWidth icon={faThumbsUp} />,
  },
];
