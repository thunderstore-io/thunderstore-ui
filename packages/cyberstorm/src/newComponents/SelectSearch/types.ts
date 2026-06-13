import { type SelectSearchModifiers } from "@thunderstore/cyberstorm-theme";

import type { SelectOption } from "../../utils/types";

export type SelectSearchBaseProps = {
  options: SelectOption<string>[];
  disabled?: boolean;
  placeholder?: string;
  csModifiers?: SelectSearchModifiers[];
  defaultOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  /** Scroll the nearest scrollable ancestor when the menu opens. Default: true */
  scrollMenuIntoView?: boolean;
  /** Optional selector for the scroll container, resolved via closest() from the select root */
  scrollContainerSelector?: string;
};

export type SelectSearchSingleProps = SelectSearchBaseProps & {
  value?: SelectOption<string>;
  onChange: (v: SelectOption<string> | undefined) => void;
};

export type SelectSearchMultipleProps = SelectSearchBaseProps & {
  value?: SelectOption<string>[];
  onChange: (v: SelectOption<string>[] | undefined) => void;
};
