import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

import styles from "./CategoryTagCloud.module.css";
import { CategorySelection, CATEGORY_STATES } from "../types";
import * as Button from "../../Button";
import { Icon } from "../../Icon/Icon";

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
    <ol className={styles.root}>
      {visible.map((c) => (
        <li key={c.slug} className={`${styles.tag} ${styles[c.selection]}`}>
          <span>{c.name}</span>
          <Button.Root
            onClick={() => clearCategory(c.slug)}
            colorScheme="transparentDefault"
            paddingSize="none"
          >
            <Button.ButtonIcon>
              <Icon>
                <FontAwesomeIcon icon={faXmark} className={styles.icon} />
              </Icon>
            </Button.ButtonIcon>
          </Button.Root>
        </li>
      ))}

      <li className={styles.clearAll}>
        <Button.Root onClick={clearAll} colorScheme="transparentTertiary">
          <Button.ButtonLabel>Clear all</Button.ButtonLabel>
        </Button.Root>
      </li>
    </ol>
  );
};

CategoryTagCloud.displayName = "CategoryTagCloud";
