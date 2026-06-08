import { type SelectSearchModifiers } from "@thunderstore/cyberstorm-theme";

import type { SelectOption } from "../../utils/types";

export type SelectSearchBaseProps = {
  options: SelectOption<string>[];
  disabled?: boolean;
  placeholder?: string;
  csModifiers?: SelectSearchModifiers[];
  defaultOpen?: boolean;
};

export type SelectSearchSingleProps = SelectSearchBaseProps & {
  value?: SelectOption<string>;
  onChange: (v: SelectOption<string> | undefined) => void;
};

export type SelectSearchMultipleProps = SelectSearchBaseProps & {
  value?: SelectOption<string>[];
  onChange: (v: SelectOption<string>[] | undefined) => void;
};
