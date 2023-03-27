import React, { useState } from "react";
import styles from "./CommunityListLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faSearch,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { CommunityLink } from "../../Links/Links";
import { TextInput } from "../../TextInput/TextInput";
import { CommunityCard } from "../../CommunityCard/CommunityCard";
import { Select } from "../../Select/Select";
import { Title } from "../../Title/Title";
import {
  getCommunityPreviewDummyData,
  getListOfIds,
} from "../../../dummyData/generate";
import { strToHashInt } from "../../../utils/utils";

export interface CommunityListLayoutProps {
  title?: string;
}

/**
 * Cyberstorm CommunityList Layout
 */
export const CommunityListLayout: React.FC<CommunityListLayoutProps> = () => {
  const [order, setOrder] = useState("1");

  return (
    <div className={styles.root}>
      <div className={styles.topNavigation}>
        <div>
          <BreadCrumbs>
            <CommunityLink community="communities">Communities</CommunityLink>
          </BreadCrumbs>
          <Title text="Communities" />
        </div>

        <div className={styles.filters}>
          <TextInput
            placeHolder="Search communities..."
            leftIcon={<FontAwesomeIcon icon={faSearch} fixedWidth />}
          />
          <Select onChange={setOrder} options={selectOptions} value={order} />
        </div>
      </div>

      <div className={styles.communityCardList}>
        {getListOfIds(20).map((id) => {
          return (
            <CommunityCard key={id} communityData={getCommunityData(id)} />
          );
        })}
      </div>
    </div>
  );
};

CommunityListLayout.displayName = "CommunityListLayout";
CommunityListLayout.defaultProps = {};

function getCommunityData(communityId: string) {
  return getCommunityPreviewDummyData(strToHashInt(communityId));
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
