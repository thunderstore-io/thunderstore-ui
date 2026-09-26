import { TextAreaInput } from "@cs/components/TextAreaInput/TextAreaInput";
import { ValidationBar } from "@cs/components/ValidationBar/ValidationBar";
import { CodeInput } from "@cs/newComponents/CodeInput/CodeInput";
import { CodeInputModifiersList } from "@cs/newComponents/CodeInput/CodeInput.types";
import { CycleButton } from "@cs/newComponents/CycleButton/CycleButton";
import { Select } from "@cs/newComponents/Select/Select";
import {
  SelectModifiersList,
  SelectSizesList,
} from "@cs/newComponents/Select/Select.types";
import { SelectSearchModifiersList } from "@cs/newComponents/SelectSearch/SelectSearch.types";
import { SelectSearchMultiple } from "@cs/newComponents/SelectSearch/SelectSearchMultiple";
import { SelectSearchSingle } from "@cs/newComponents/SelectSearch/SelectSearchSingle";
import { Switch } from "@cs/newComponents/Switch/Switch";
import { SwitchSizesList } from "@cs/newComponents/Switch/Switch.types";
import { TextInput } from "@cs/newComponents/TextInput/TextInput";
import {
  TextInputModifiersList,
  TextInputSizesList,
} from "@cs/newComponents/TextInput/TextInput.types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, States, compositionParameters } from "./compare";
import { searchOptions, selectOptions } from "./fixtures";

/**
 * Featuring: TextInput, TextAreaInput, Select, SelectSearch, Switch,
 * CodeInput, ValidationBar, CycleButton. The select menu is open; other
 * fields stay above it. See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Form",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Upload and settings form: text input, textarea, select, select search, switch, code input, validation bar, and cycle button. The select menu is open, with empty space under it so the menu does not cover the other fields. The rows under the layout are the variant, size, and modifier states from the component stories.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const codeSample = 'console.log("example log");';

function ignore() {}

function FormFields({ scope }: { scope: string }) {
  return (
    <div className="cs-page">
      <TextInput
        defaultValue="Northstar"
        placeholder="Package name"
        aria-label="Package name"
      />
      <TextAreaInput value="A cool mod for Valheim." />
      <SelectSearchSingle
        options={searchOptions}
        value={searchOptions[0]}
        onChange={ignore}
        placeholder="Search categories"
        scrollMenuIntoView={false}
      />
      <div className="cs-page__row">
        <Switch id={`${scope}-form-nsfw`} value={false} />
        <Switch id={`${scope}-form-deprecated`} value />
      </div>
      <CodeInput
        value={codeSample}
        aria-label="Manifest"
        validationBarProps={{ status: "waiting", message: "Waiting for input" }}
      />
      <ValidationBar status="waiting" message="Waiting for input" />
      <CycleButton
        options={["Newest", "Oldest", "Most downloaded"]}
        onValueChange={ignore}
      >
        Newest
      </CycleButton>
      <div className="cs-compare__menu-space">
        <Select
          options={selectOptions}
          value="newest"
          placeholder="Sort"
          aria-label="Sort"
          defaultOpen
        />
      </div>

      <States title="Text input sizes and modifiers">
        {TextInputSizesList.map((size) => (
          <TextInput
            key={size}
            csSize={size}
            placeholder={size}
            aria-label={size}
          />
        ))}
        {TextInputModifiersList.filter((modifier) => modifier !== "").map(
          (modifier) => (
            <TextInput
              key={modifier}
              csModifiers={[modifier]}
              placeholder={modifier}
              aria-label={modifier}
            />
          )
        )}
      </States>
      <States title="Textarea">
        <TextAreaInput value="Some text..." />
      </States>
      <States title="Select sizes">
        {SelectSizesList.map((size) => (
          <Select
            key={size}
            csSize={size}
            options={selectOptions}
            value="newest"
            aria-label={size}
          />
        ))}
        {SelectModifiersList.map((modifier) => (
          <Select
            key={modifier}
            csModifiers={[modifier]}
            options={selectOptions}
            value="newest"
            aria-label={modifier}
          />
        ))}
      </States>
      <States title="Select search">
        <div className="cs-compare__menu-space">
          <SelectSearchSingle
            options={searchOptions}
            onChange={ignore}
            placeholder="Single"
            defaultOpen
            scrollMenuIntoView={false}
          />
        </div>
        <div className="cs-compare__menu-space">
          <SelectSearchMultiple
            options={searchOptions}
            value={[searchOptions[1]]}
            onChange={ignore}
            placeholder="Multiple"
            defaultOpen
            scrollMenuIntoView={false}
          />
        </div>
        {SelectSearchModifiersList.filter((modifier) => modifier !== "").map(
          (modifier) => (
            <SelectSearchSingle
              key={modifier}
              options={searchOptions}
              value={searchOptions[0]}
              onChange={ignore}
              placeholder={modifier}
              csModifiers={[modifier]}
              scrollMenuIntoView={false}
            />
          )
        )}
      </States>
      <States title="Switch">
        {SwitchSizesList.map((size) => (
          <Switch key={size} value={size === "medium"} csSize={size} />
        ))}
        <Switch value={false} disabled csModifiers={["disabled"]} />
      </States>
      <States title="Code input">
        <CodeInput
          value=""
          placeholder="Code here..."
          aria-label="Empty code"
        />
        <CodeInput
          value={codeSample}
          aria-label="Failed code"
          validationBarProps={{ status: "failure", message: "failure message" }}
        />
        <CodeInput
          value={codeSample}
          aria-label="Successful code"
          validationBarProps={{ status: "success", message: "Success message" }}
        />
        {CodeInputModifiersList.filter((modifier) => modifier !== "").map(
          (modifier) => (
            <CodeInput
              key={modifier}
              value={codeSample}
              csModifiers={[modifier]}
              aria-label={modifier}
            />
          )
        )}
      </States>
      <States title="Validation bar">
        <ValidationBar status="waiting" message="Waiting for input" />
        <ValidationBar status="success" message="Success!" />
        <ValidationBar status="failure" message="Failure!" />
      </States>
      <States title="Cycle button">
        <CycleButton noState onInteract={ignore}>
          Click me
        </CycleButton>
      </States>
    </div>
  );
}

export const Page: Story = {
  render: () => <SideBySide render={(scope) => <FormFields scope={scope} />} />,
};
