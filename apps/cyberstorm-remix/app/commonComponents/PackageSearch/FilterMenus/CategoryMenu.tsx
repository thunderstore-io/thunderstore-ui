import {
  faSquare,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./FilterMenu.module.css";
import { CategorySelection, CATEGORY_STATES as STATES } from "../types";
import { CycleButton, NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

interface Props {
  categories: CategorySelection[];
  includedCategories: string;
  excludedCategories: string;
  setCategories: (v: CategorySelection[]) => void;
}

/**
 * Allow filtering packages by categories on PackageSearch.
 *
 * TODO TS-1715: show number of packages on each category.
 */
export const CategoryMenu = (props: Props) => {
  const { categories, includedCategories, excludedCategories, setCategories } =
    props;

  const parsedCategories = parseCategories(
    categories,
    includedCategories,
    excludedCategories
  );
  const toggleCategory = (id: string) =>
    setCategories(toggle(parsedCategories, id));

  if (parsedCategories.length) {
    return (
      <ol className={styles.list}>
        {parsedCategories.map((c) => (
          <li key={c.slug}>
            <label className={classnames(styles.label, styles[c.selection])}>
              {c.name}
              <CycleButton
                onInteract={() => toggleCategory(c.id)}
                rootClasses={styles.checkbox}
                value={c.selection}
                noState
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon
                    icon={
                      c.selection === "include"
                        ? faSquareCheck
                        : c.selection === "exclude"
                          ? faSquareXmark
                          : faSquare
                    }
                  />
                </NewIcon>
              </CycleButton>
            </label>
          </li>
        ))}
      </ol>
    );
  } else {
    return <p>No categories</p>;
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

function parseCategories(
  categories: CategorySelection[],
  includedCategories: string,
  excludedCategories: string
): CategorySelection[] {
  const iCArr = includedCategories.split(",");
  const eCArr = excludedCategories.split(",");
  return categories.map((c) =>
    iCArr.includes(c.id)
      ? { ...c, selection: "include" }
      : eCArr.includes(c.id)
        ? { ...c, selection: "exclude" }
        : c
  );
}
