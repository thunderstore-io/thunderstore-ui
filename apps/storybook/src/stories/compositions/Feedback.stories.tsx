import { CodeBox } from "@cs/components/CodeBox/CodeBox";
import { CopyButton } from "@cs/components/CopyButton/CopyButton";
import { Alert } from "@cs/newComponents/Alert/Alert";
import { AlertVariantsList } from "@cs/newComponents/Alert/Alert.types";
import { Button } from "@cs/newComponents/Button/Button";
import { Container } from "@cs/newComponents/Container/Container";
import * as EmptyState from "@cs/newComponents/EmptyState";
import { Link } from "@cs/newComponents/Link/Link";
import { SkeletonBox } from "@cs/newComponents/SkeletonBox/SkeletonBox";
import { Tabs } from "@cs/newComponents/Tabs/Tabs";
import { Provider as ToastProvider } from "@cs/newComponents/Toast/Provider";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, States, compositionParameters } from "./compare";

/**
 * Featuring: Alert, EmptyState, SkeletonBox, CopyButton, CodeBox, Container,
 * Tabs. Toast is mounted closed (the trigger only). The open toast panel is
 * Compositions/Overlays/Toast. See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Feedback",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Feedback and utility layout: alert, empty state, skeleton, copy button, code box, container, and tabs, plus the closed toast. Only the toast trigger is mounted here. The toast panel is position fixed, so the open panel is Compositions/Overlays/Toast. The rows under the layout are the variant and size states from the component stories.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const installCommand = "npm i @thunderstore/cyberstorm";

function Feedback() {
  return (
    <ToastProvider toastDuration={600000}>
      <div className="cs-page">
        <Alert csVariant="info">Package uploaded.</Alert>
        <EmptyState.Root>
          <EmptyState.Icon>
            <FontAwesomeIcon icon={faSearch} />
          </EmptyState.Icon>
          <EmptyState.Title>No results</EmptyState.Title>
          <EmptyState.Message>Try adjusting your filters.</EmptyState.Message>
        </EmptyState.Root>
        <div style={{ width: 300, height: 80 }}>
          <SkeletonBox />
        </div>
        <CopyButton text="npm i @thunderstore/cyberstorm" />
        <CodeBox value={installCommand} />
        <CodeBox value={installCommand} inline />
        <Container>
          <div style={{ border: "1px dashed currentColor", padding: 16 }}>
            Container content
          </div>
        </Container>
        <Tabs>
          <Link
            key="settings"
            primitiveType="cyberstormLink"
            linkId="TeamSettingsSettings"
            aria-current
            rootClasses="tabs-item tabs-item--current"
            team="test-team"
          >
            Settings
          </Link>
          <Link
            key="service-accounts"
            primitiveType="cyberstormLink"
            linkId="TeamSettingsServiceAccounts"
            aria-current={false}
            rootClasses="tabs-item"
            team="test-team"
          >
            Service Accounts
          </Link>
        </Tabs>
        <Tabs>
          <Link
            primitiveType="cyberstormLink"
            linkId="Index"
            aria-current
            rootClasses="tabs-item tabs-item--current"
          >
            Loooooooooooooooooooong content
          </Link>
          <Link
            primitiveType="cyberstormLink"
            linkId="Index"
            aria-current={false}
            rootClasses="tabs-item"
          >
            Long content with shorter words
          </Link>
          <Link
            primitiveType="cyberstormLink"
            linkId="Index"
            aria-current={false}
            rootClasses="tabs-item"
          >
            Long content
          </Link>
          <Link
            primitiveType="cyberstormLink"
            linkId="Index"
            aria-current={false}
            rootClasses="tabs-item"
          >
            Looooooooooooooooooooooooooooooooonoooooooooooooog
          </Link>
        </Tabs>
        <Button csVariant="secondary">Show toast</Button>

        <States title="Alert variants">
          {AlertVariantsList.map((variant) => (
            <Alert key={variant} csVariant={variant}>
              This is an alert with variant: {variant}
            </Alert>
          ))}
        </States>
        <States title="Container">
          <Container size="wide">
            <div style={{ border: "1px dashed currentColor", padding: 16 }}>
              Wide container content.
            </div>
          </Container>
        </States>
      </div>
    </ToastProvider>
  );
}

export const Page: Story = {
  render: () => <SideBySide render={() => <Feedback />} />,
};
