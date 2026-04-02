import { isPromise } from "cyberstorm/utils/typeChecks";
import { Suspense } from "react";
import { Await } from "react-router";

interface Props<T> {
  resolve: T;
  children: (resolvedValue: Awaited<T>) => React.ReactNode;
  fallback?: React.ReactNode;
  errorElement?: React.ReactNode;
}

export function SuspenseIfPromise<T>({
  resolve,
  children,
  fallback,
  errorElement,
}: Props<T>) {
  if (isPromise(resolve)) {
    return (
      <Suspense fallback={fallback}>
        <Await resolve={resolve} errorElement={errorElement}>
          {children}
        </Await>
      </Suspense>
    );
  }

  // Await expects children to be a function, or React node.
  // We mirror the children as a function behavior.
  return <>{children(resolve as Awaited<T>)}</>;
}
