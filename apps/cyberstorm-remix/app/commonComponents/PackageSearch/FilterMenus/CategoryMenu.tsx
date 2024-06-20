import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Dispatch, SetStateAction } from "react";

import styles from "./FilterMenu.module.css";
import { CategorySelection, CATEGORY_STATES as STATES } from "../types";
import { Icon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

interface Props {
  categories: CategorySelection[];
  setCategories: Dispatch<SetStateAction<CategorySelection[]>>;
}

/**
 * Allow filtering packages by categories on PackageSearch.
 *
 * TODO TS-1715: show number of packages on each category.
 */
export const CategoryMenu = (props: Props) => {
  const { categories, setCategories } = props;

  const toggleCategory = (id: string) => setCategories(toggle(categories, id));

  if (categories.length) {
    return (
      <ol className={styles.list}>
        {categories.map((c) => (
          <li key={c.slug}>
            <label
              className={classnames(
                styles.label,
                c.selection !== "off" ? styles[c.selection] : undefined
              )}
            >
              <Checkbox.Root
                checked={c.selection !== "off"}
                onCheckedChange={() => toggleCategory(c.id)}
                className={styles.checkbox}
              >
                <Checkbox.Indicator>
                  <Icon>
                    <FontAwesomeIcon
                      icon={c.selection === "include" ? faCheck : faXmark}
                      className={styles.icon}
                    />
                  </Icon>
                </Checkbox.Indicator>
              </Checkbox.Root>
              {c.name}
            </label>
          </li>
        ))}
      </ol>
    );
  } else {
    return <p className={styles.empty}>No categories</p>;
  }
};

CategoryMenu.displayName = "CategoryMenu";

/**
 * Three-way toggle a category and return a copy of the category list.
 *
 * Toggling "off" -> "include" -> "exclude" -> "off"
 */
const toggle = (categories: CategorySelection[], targetId: string) =>
  categories.map((c) => {
    if (c.id === targetId) {
      const nextIndex = (STATES.indexOf(c.selection) + 1) % STATES.length;
      return { ...c, selection: STATES[nextIndex] };
    }
    return c;
  });
