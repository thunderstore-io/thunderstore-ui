import { type ReactNode, Suspense } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

/**
 * A wrapper around React's Suspense component that conditionally renders Suspense
 * only on the client-side (CSR). During Server-Side Rendering (SSR), it renders
 * the children directly without a Suspense boundary.
 *
 * This checks if the component is mounted on the client to determine the environment
 * across hydration passes.
 *
 * Use this to avoid Suspense limitations or issues during SSR, while still
 * benefiting from Suspense on the client.
 *
 * We want to skip Suspense in SSR until React has addressed their limitations
 * on Suspense nesting and the how Suspense fallback trigger calculation is being done.
 * ref. Since React 19.2 Suspense fallback trigger calculations includes byte size of all children too
 */
export function ClientSuspense({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <>{children}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
}
