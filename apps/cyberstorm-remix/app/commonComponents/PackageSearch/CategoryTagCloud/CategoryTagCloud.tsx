import { faBan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./CategoryTagCloud.module.css";
import { CategorySelection, CATEGORY_STATES } from "../types";
import { NewButton, NewIcon, NewTag } from "@thunderstore/cyberstorm";

const OFF = CATEGORY_STATES[0];

interface Props {
  searchValue: string;
  setSearchValue: (v: string) => void;
  categories: CategorySelection[];
  setCategories: (v: CategorySelection[]) => void;
}

/**
 * Show currently selected category filters.
 */
export const CategoryTagCloud = (props: Props) => {
  const { searchValue, setSearchValue, categories, setCategories } = props;
  const visible = categories.filter((c) => c.selection !== "off");

  if (!visible.length && searchValue === "") {
    return null;
  }

  const clearCategory = (id: string) =>
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, selection: OFF } : c))
    );

  const clearAll = () => {
    setCategories(categories.map((c) => ({ ...c, selection: OFF })));
    setSearchValue("");
  };

  return (
    <div className={styles.root}>
      {searchValue !== "" ? (
        <NewTag
          csMode="button"
          onClick={() => setSearchValue("")}
          csSize="medium"
        >
          <span>{`"${searchValue}"`}</span>
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faXmark} className={styles.icon} />
          </NewIcon>
        </NewTag>
      ) : null}
      {visible.map((c) => (
        <NewTag
          csMode="button"
          key={c.slug}
          onClick={() => clearCategory(c.id)}
          csVariant={c.selection === "exclude" ? "red" : "primary"}
          csSize="medium"
          csModifiers={
            c.selection === "exclude" ? ["dark", "hoverable"] : ["hoverable"]
          }
        >
          {c.selection === "exclude" ? (
            <NewIcon csMode="inline">
              <FontAwesomeIcon icon={faBan} />
            </NewIcon>
          ) : undefined}
          <span>{c.name}</span>
          <NewIcon csMode="inline" noWrapper rootClasses={styles.icon}>
            <FontAwesomeIcon icon={faXmark} />
          </NewIcon>
        </NewTag>
      ))}
      <NewButton
        onClick={clearAll}
        csVariant="secondary"
        csSize="small"
        csModifiers={["ghost"]}
        rootClasses={styles.clearButton}
      >
        <span>Clear all</span>
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faXmark} className={styles.icon} />
        </NewIcon>
      </NewButton>
    </div>
  );
};

CategoryTagCloud.displayName = "CategoryTagCloud";
