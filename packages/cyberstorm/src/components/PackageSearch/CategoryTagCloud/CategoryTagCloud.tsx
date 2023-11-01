import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

import styles from "./CategoryTagCloud.module.css";
import { CategorySelection, CATEGORY_STATES } from "../types";
import * as Button from "../../Button";

const OFF = CATEGORY_STATES[0];

interface Props {
  categories: CategorySelection[];
  setCategories: Dispatch<SetStateAction<CategorySelection[]>>;
}

/**
 * Show currently selected category filters.
 */
export const CategoryTagCloud = (props: Props) => {
  const { categories, setCategories } = props;
  const visible = categories.filter((c) => c.selection !== "off");

  if (!visible.length) {
    return null;
  }

  const clearCategory = (slug: string) =>
    setCategories(
      categories.map((c) => (c.slug === slug ? { ...c, selection: OFF } : c))
    );

  const clearAll = () =>
    setCategories(categories.map((c) => ({ ...c, selection: OFF })));

  return (
    <div className={styles.root}>
      {visible.map((c) => (
        <Button.Root
          key={c.slug}
          onClick={() => clearCategory(c.slug)}
          colorScheme={c.selection === "exclude" ? "danger" : "default"}
          paddingSize="small"
          style={{ gap: "0.5rem" }}
        >
          <Button.ButtonLabel>{c.name}</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faXmark} className={styles.icon} />
          </Button.ButtonIcon>
        </Button.Root>
      ))}
      <Button.Root
        onClick={clearAll}
        colorScheme="transparentTertiary"
        paddingSize="small"
      >
        <Button.ButtonLabel>Clear all</Button.ButtonLabel>
      </Button.Root>
    </div>
  );
};

CategoryTagCloud.displayName = "CategoryTagCloud";
