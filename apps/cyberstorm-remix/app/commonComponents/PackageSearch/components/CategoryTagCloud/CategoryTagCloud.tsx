import { faBan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./CategoryTagCloud.css";
import { CategorySelection, TRISTATE_STATES } from "../../../types";
import { NewButton, NewIcon, NewTag } from "@thunderstore/cyberstorm";

const OFF = TRISTATE_STATES[0];

interface Props {
  searchValue: string;
  setSearchValue: (v: string) => void;
  categories: CategorySelection[];
  setCategories: (v: CategorySelection[]) => void;
  rootClasses: string;
  clearAll: () => void;
}

/**
 * Show currently selected category filters.
 */
export const CategoryTagCloud = (props: Props) => {
  const {
    searchValue,
    setSearchValue,
    categories,
    setCategories,
    rootClasses,
    clearAll,
  } = props;
  const visible = categories.filter((c) => c.selection !== "off");

  if (!visible.length && searchValue === "") {
    return null;
  }

  const clearCategory = (id: string) =>
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, selection: OFF } : c))
    );

  return (
    <div className={`category-tag-cloud ${rootClasses}`}>
      {searchValue !== "" ? (
        <NewTag
          csMode="button"
          onClick={() => setSearchValue("")}
          csSize="medium"
          rootClasses="category-tag-cloud__search-tag"
        >
          <span>{`"${searchValue}"`}</span>
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faXmark} />
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
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faXmark} />
          </NewIcon>
        </NewTag>
      ))}
      <NewButton
        onClick={clearAll}
        csVariant="secondary"
        csSize="small"
        csModifiers={["ghost"]}
        rootClasses="category-tag-cloud__clear-button"
      >
        <span>Clear all</span>
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faXmark} />
        </NewIcon>
      </NewButton>
    </div>
  );
};

CategoryTagCloud.displayName = "CategoryTagCloud";
