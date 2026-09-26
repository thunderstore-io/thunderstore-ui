import { Provider as ToastProvider } from "@cs/newComponents/Toast/Provider";
import { Toast } from "@cs/newComponents/Toast/Toast";
import { ToastVariantsList } from "@cs/newComponents/Toast/Toast.types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, compositionParameters } from "../compare";

/**
 * Open toast. The closed trigger is in Compositions/Feedback.
 * See the featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Overlays/Toast",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Open toast panel. The closed trigger lives in Compositions/Feedback. This story is separate because the toast panel is position fixed and would cover a shared page canvas. toastDuration is long so the timer does not dismiss the panel during capture.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenToasts({ scope }: { scope: string }) {
  return (
    <ToastProvider toastDuration={600000}>
      <div style={{ minHeight: 360 }}>
        {ToastVariantsList.map((variant) => (
          <Toast
            key={variant}
            id={`${scope}-toast-${variant}`}
            csVariant={variant}
            duration={600000}
          >
            Toast {variant}
          </Toast>
        ))}
      </div>
    </ToastProvider>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={(scope) => <OpenToasts scope={scope} />} />,
};
