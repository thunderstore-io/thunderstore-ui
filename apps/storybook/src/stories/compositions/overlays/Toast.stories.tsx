import {
  Provider as ToastProvider,
  useToast,
} from "@cs/newComponents/Toast/Provider";
import { ToastVariantsList } from "@cs/newComponents/Toast/Toast.types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";

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
    chromatic: { ...compositionParameters.chromatic, delay: 300 },
    docs: {
      description: {
        component:
          "Open toasts in the production viewport. The closed trigger lives in Compositions/Feedback. Variants are added with useToast(), so they render in the fixed .toast__viewport instead of ordinary flow. This story is separate because that viewport is position fixed and would cover a shared page canvas. The duration is long so the timer does not dismiss the panel during capture.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SeedToasts() {
  const { addToast } = useToast();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) {
      return;
    }
    seeded.current = true;
    for (const variant of ToastVariantsList) {
      addToast({
        csVariant: variant,
        duration: 600000,
        children: `Toast ${variant}`,
      });
    }
  }, [addToast]);

  // The viewport is position fixed to the bottom of this column, so the
  // column has to be tall enough to contain it. Without theme tokens the
  // icon stretches to the toast width and the stack is about 1450px.
  return <div style={{ minHeight: 1560 }} />;
}

function OpenToasts() {
  return (
    <ToastProvider toastDuration={600000}>
      <SeedToasts />
    </ToastProvider>
  );
}

export const Open: Story = {
  render: () => <SideBySide render={() => <OpenToasts />} />,
};
