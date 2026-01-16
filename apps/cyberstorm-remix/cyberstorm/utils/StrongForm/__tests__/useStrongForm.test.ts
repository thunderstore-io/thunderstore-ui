import React, { useLayoutEffect, useRef } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, assert, describe, expect, it, vi } from "vitest";

import {
  ParseError,
  RequestBodyParseError,
  RequestQueryParamsParseError,
} from "../../../../../../packages/thunderstore-api/src";
import { useStrongForm } from "../useStrongForm";
import type { Validator } from "../validation";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function flushMicrotasks(times = 3) {
  for (let i = 0; i < times; i++) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
}

function render(element: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  let didUnmount = false;
  const unmount = () => {
    if (didUnmount) return;
    didUnmount = true;
    act(() => {
      root.unmount();
    });
    container.remove();
  };

  cleanupMounted.push(unmount);

  act(() => {
    root.render(element);
  });

  return {
    root,
    container,
    unmount,
  };
}

type Inputs = { name: string };
type AnyStrongForm = ReturnType<
  typeof useStrongForm<Inputs, unknown, unknown, unknown, unknown, unknown>
>;

// React 18 act() warning suppression: mark the environment as act-capable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function useConst<T>(create: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = create();
  }
  return ref.current;
}

function assertAssigned<T>(value: T | null | undefined): asserts value is T {
  if (value == null) {
    throw new Error("Expected value to be assigned");
  }
}

const cleanupMounted: Array<() => void> = [];

afterEach(() => {
  while (cleanupMounted.length > 0) {
    cleanupMounted.pop()?.();
  }
});

describe("StrongForm.useStrongForm", () => {
  it("provides required/aria-required and invalid state based on interactions", async () => {
    let strongForm: AnyStrongForm | undefined;

    const submitor = vi.fn(async () => "ok");

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          string,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "" })),
          validators: useConst(() => ({ name: { required: true } }) as const),
          submitor,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    const initialProps = strongForm.getFieldComponentProps("name");
    assert.equal(initialProps.required, true);
    assert.equal(initialProps["aria-required"], true);
    assert.equal(initialProps["aria-invalid"], false);

    await act(async () => {
      strongForm!.getFieldInteractionProps("name").onFocus();
      strongForm!.getFieldInteractionProps("name").onFocus();
      strongForm!.getFieldInteractionProps("name").onBlur();
      strongForm!.getFieldInteractionProps("name").onBlur();
      await flushMicrotasks();
    });

    const afterInteractionProps = strongForm.getFieldComponentProps("name");
    assert.equal(afterInteractionProps["aria-invalid"], true);
    assert.ok(afterInteractionProps.csModifiers?.includes("invalid"));

    const disabledProps = strongForm.getFieldComponentProps("name", {
      disabled: true,
    });
    assert.ok(disabledProps.csModifiers?.includes("disabled"));

    unmount();
  });

  it("handleSubmit prevents enter-submit when required fields are trim-empty", async () => {
    let strongForm: AnyStrongForm | undefined;

    const submitor = vi.fn(async () => undefined);

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "   " })),
          validators: useConst(() => ({ name: { required: true } }) as const),
          submitor,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assert.equal(strongForm.isReady, false);

    const preventDefault = vi.fn();
    await act(async () => {
      strongForm!.handleSubmit({ preventDefault });
      await flushMicrotasks();
    });

    assert.equal(preventDefault.mock.calls.length, 1);
    assert.equal(submitor.mock.calls.length, 0);

    // submit attempt should make the invalid UI state visible
    assert.equal(strongForm.getFieldState("name").isInvalid, true);

    unmount();
  });

  it("submit returns early when !isReady (without calling submitor)", async () => {
    let strongForm: AnyStrongForm | undefined;

    const submitor = vi.fn(async () => "ok");

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          string,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "   " })),
          validators: useConst(() => ({ name: { required: true } }) as const),
          submitor,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assert.equal(strongForm.isReady, false);

    await act(async () => {
      await strongForm!.submit();
      await flushMicrotasks();
    });

    assert.equal(submitor.mock.calls.length, 0);

    unmount();
  });

  it("clears submitOutput + submitError when inputs change", async () => {
    let strongForm: AnyStrongForm | undefined;
    let setInputs: React.Dispatch<React.SetStateAction<Inputs>> | undefined;

    const submitor = vi.fn(async () => "ok");

    const { unmount } = render(
      React.createElement(function Harness() {
        const [inputs, innerSetInputs] = React.useState<Inputs>({ name: "ok" });
        setInputs = innerSetInputs;

        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          string,
          Error,
          unknown
        >({
          inputs,
          validators: useConst(() => ({ name: { required: true } }) as const),
          submitor,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assertAssigned(setInputs);

    await act(async () => {
      await strongForm!.submit();
      await flushMicrotasks();
    });

    assert.equal(strongForm.submitOutput, "ok");
    assert.equal(strongForm.submitError, undefined);

    await act(async () => {
      setInputs!({ name: "changed" });
      await flushMicrotasks();
    });

    assert.equal(strongForm.submitOutput, undefined);
    assert.equal(strongForm.submitError, undefined);

    unmount();
  });

  it("does not restart refinement when inputs change while refining", async () => {
    let strongForm: AnyStrongForm | undefined;
    let setInputs: React.Dispatch<React.SetStateAction<Inputs>> | undefined;

    const refinerDeferred = deferred<Inputs>();
    const refiner = vi.fn(async () => refinerDeferred.promise);

    const { unmount } = render(
      React.createElement(function Harness() {
        const [inputs, innerSetInputs] = React.useState<Inputs>({ name: "ok" });
        setInputs = innerSetInputs;

        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs,
          refiner,
          submitor: async () => undefined,
        });

        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assertAssigned(setInputs);
    assert.equal(strongForm.refining, true);
    assert.equal(refiner.mock.calls.length, 1);

    await act(async () => {
      setInputs!({ name: "changed" });
      await flushMicrotasks();
    });

    // The effect is keyed on inputs, but should no-op while refining.
    assert.equal(refiner.mock.calls.length, 1);

    refinerDeferred.resolve({ name: "changed" });
    await act(async () => {
      await flushMicrotasks();
    });

    unmount();
  });

  it("throws 'Form has not been refined yet!' if submit happens before first effect", async () => {
    const onSubmitError = vi.fn();
    const submitErrorDeferred = deferred<unknown>();

    render(
      React.createElement(function Harness() {
        const strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          refiner: async (inputs) => inputs,
          submitor: async () => undefined,
          onSubmitError,
        });

        useLayoutEffect(() => {
          void strongForm.submit().then(
            () => submitErrorDeferred.resolve("no-error"),
            (err) => submitErrorDeferred.resolve(err)
          );
        }, []);

        return React.createElement("div");
      })
    );

    const result = await submitErrorDeferred.promise;
    assert.instanceOf(result, Error);
    assert.match((result as Error).message, /not been refined yet/i);
    assert.equal(onSubmitError.mock.calls.length, 1);
  });

  it("throws while refining", async () => {
    let strongForm: AnyStrongForm | undefined;

    const refinerDeferred = deferred<Inputs>();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          refiner: async () => refinerDeferred.promise,
          submitor: async () => undefined,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await expect(strongForm.submit()).rejects.toThrow(/still refining/i);

    refinerDeferred.resolve({ name: "ok" });

    unmount();
  });

  it("calls onSubmitError when submit is invoked while refining", async () => {
    let strongForm: AnyStrongForm | undefined;

    const refinerDeferred = deferred<Inputs>();
    const onSubmitError = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          refiner: async () => refinerDeferred.promise,
          submitor: async () => undefined,
          onSubmitError,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await expect(strongForm.submit()).rejects.toThrow(/still refining/i);
    assert.equal(onSubmitError.mock.calls.length, 1);
    assert.match(
      String(onSubmitError.mock.calls[0]?.[0]?.message),
      /still refining/i
    );

    refinerDeferred.resolve({ name: "ok" });
    unmount();
  });

  it("throws refineError and calls onSubmitError with a generic refinement error", async () => {
    let strongForm: AnyStrongForm | undefined;

    const refineFailure = new Error("refine failed");
    const onSubmitError = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          refiner: async () => {
            throw refineFailure;
          },
          submitor: async () => undefined,
          onSubmitError,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await expect(strongForm.submit()).rejects.toBe(refineFailure);

    assert.equal(onSubmitError.mock.calls.length, 1);
    assert.match(
      String(onSubmitError.mock.calls[0]?.[0]?.message),
      /refinement failed/i
    );

    unmount();
  });

  it("throws when submitting twice", async () => {
    let strongForm: AnyStrongForm | undefined;

    const submitorDeferred = deferred<unknown>();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => submitorDeferred.promise,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    let firstSubmitPromise: Promise<unknown>;
    await act(async () => {
      firstSubmitPromise = strongForm!.submit();
      await flushMicrotasks();
    });

    await expect(strongForm.submit()).rejects.toThrow(/already submitting/i);

    submitorDeferred.resolve(undefined);
    await firstSubmitPromise!;

    unmount();
  });

  it("calls onSubmitError when submitting twice", async () => {
    let strongForm: AnyStrongForm | undefined;

    const submitorDeferred = deferred<unknown>();
    const onSubmitError = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => submitorDeferred.promise,
          onSubmitError,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    let firstSubmitPromise: Promise<unknown>;
    await act(async () => {
      firstSubmitPromise = strongForm!.submit();
      await flushMicrotasks();
    });

    await expect(strongForm.submit()).rejects.toThrow(/already submitting/i);
    assert.equal(onSubmitError.mock.calls.length, 1);
    assert.match(
      String(onSubmitError.mock.calls[0]?.[0]?.message),
      /already submitting/i
    );

    submitorDeferred.resolve(undefined);
    await firstSubmitPromise!;

    unmount();
  });

  it("sets submitError + inputErrors on RequestBodyParseError and does not throw", async () => {
    let strongForm: AnyStrongForm | undefined;

    const bodyParseError = Object.assign(
      Object.create(RequestBodyParseError.prototype),
      {
        error: { formErrors: { name: "bad" } },
      }
    );

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          { name?: string }
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw bodyParseError;
          },
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await strongForm.submit();

    await act(async () => {
      await flushMicrotasks();
    });

    assert.instanceOf(strongForm.submitError, Error);
    assert.match(
      String(strongForm.submitError?.message),
      /field values are invalid/i
    );
    assert.deepEqual(strongForm.inputErrors, { name: "bad" });

    unmount();
  });

  it("sets submitError + inputErrors on RequestQueryParamsParseError and does not throw", async () => {
    let strongForm: AnyStrongForm | undefined;

    const queryParseError = Object.assign(
      Object.create(RequestQueryParamsParseError.prototype),
      {
        error: { formErrors: { name: "bad" } },
      }
    );

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          { name?: string }
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw queryParseError;
          },
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await strongForm.submit();

    await act(async () => {
      await flushMicrotasks();
    });

    assert.instanceOf(strongForm.submitError, Error);
    assert.match(
      String(strongForm.submitError?.message),
      /query parameters are invalid/i
    );
    assert.deepEqual(strongForm.inputErrors, { name: "bad" });

    unmount();
  });

  it("sets submitError + inputErrors and throws on ParseError", async () => {
    let strongForm: AnyStrongForm | undefined;

    const parseError = Object.assign(Object.create(ParseError.prototype), {
      error: { formErrors: { name: "bad" } },
    });

    const onSubmitError = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          unknown,
          { name?: string }
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw parseError;
          },
          onSubmitError,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await expect(strongForm.submit()).rejects.toBe(parseError);

    await act(async () => {
      await flushMicrotasks();
    });

    assert.instanceOf(strongForm.submitError, Error);
    assert.match(
      String(strongForm.submitError?.message),
      /response was invalid/i
    );
    assert.deepEqual(strongForm.inputErrors, { name: "bad" });

    assert.equal(onSubmitError.mock.calls.length, 1);
    assert.equal(onSubmitError.mock.calls[0]?.[0], parseError);

    unmount();
  });

  it("propagates unknown submit errors through onSubmitError", async () => {
    let strongForm: AnyStrongForm | undefined;

    const failure = new Error("boom");
    const onSubmitError = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          unknown,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw failure;
          },
          onSubmitError,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await expect(strongForm.submit()).rejects.toBe(failure);
    assert.equal(onSubmitError.mock.calls.length, 1);
    assert.equal(onSubmitError.mock.calls[0]?.[0], failure);

    unmount();
  });

  it("throws unknown submit errors when no onSubmitError is provided", async () => {
    let strongForm: AnyStrongForm | undefined;

    const failure = new Error("boom");

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          unknown,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw failure;
          },
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    let caught: unknown;
    await act(async () => {
      await strongForm!.submit().catch((error) => {
        caught = error;
      });
      await flushMicrotasks();
    });

    assert.equal(caught, failure);

    unmount();
  });

  it("handleSubmit logs unexpected errors when no onSubmitError is provided", async () => {
    let strongForm: AnyStrongForm | undefined;

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          unknown,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw new Error("boom");
          },
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    const preventDefault = vi.fn();
    await act(async () => {
      strongForm!.handleSubmit({ preventDefault });
      await flushMicrotasks();
    });

    assert.equal(preventDefault.mock.calls.length, 1);
    assert.equal(consoleErrorSpy.mock.calls.length, 1);

    consoleErrorSpy.mockRestore();
    unmount();
  });

  it("handleSubmit does not log when onSubmitError is provided", async () => {
    let strongForm: AnyStrongForm | undefined;

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const onSubmitError = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          unknown,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => {
            throw new Error("boom");
          },
          onSubmitError,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    const preventDefault = vi.fn();
    await act(async () => {
      strongForm!.handleSubmit({ preventDefault });
      await flushMicrotasks();
    });

    assert.equal(preventDefault.mock.calls.length, 1);
    assert.equal(onSubmitError.mock.calls.length, 1);
    assert.equal(consoleErrorSpy.mock.calls.length, 0);

    consoleErrorSpy.mockRestore();
    unmount();
  });

  it("calls onSubmitSuccess on successful submit", async () => {
    let strongForm: AnyStrongForm | undefined;

    const onSubmitSuccess = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          string,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => "done",
          onSubmitSuccess,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await strongForm.submit();

    await act(async () => {
      await flushMicrotasks();
    });

    assert.equal(onSubmitSuccess.mock.calls.length, 1);

    unmount();
  });

  it("throws when onSubmitSuccess throws and no onSubmitError is provided", async () => {
    let strongForm: AnyStrongForm | undefined;

    const failure = new Error("boom");

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          string,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => "done",
          onSubmitSuccess: () => {
            throw failure;
          },
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    let caught: unknown;
    await act(async () => {
      await strongForm!.submit().catch((error) => {
        caught = error;
      });
      await flushMicrotasks();
    });

    assert.equal(caught, failure);

    unmount();
  });

  it("submits successfully when onSubmitSuccess is not provided", async () => {
    let strongForm: AnyStrongForm | undefined;

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          string,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => "done",
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);

    await strongForm.submit();

    await act(async () => {
      await flushMicrotasks();
    });

    assert.equal(strongForm.submitOutput, "done");

    unmount();
  });

  it("isReady returns true when no validators are provided", async () => {
    let strongForm: AnyStrongForm | undefined;

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          submitor: async () => undefined,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assert.equal(strongForm.isReady, true);

    unmount();
  });

  it("onRefineSuccess is called when refiner succeeds", async () => {
    let strongForm: AnyStrongForm | undefined;

    const onRefineSuccess = vi.fn();

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          refiner: async (inputs) => inputs,
          onRefineSuccess,
          submitor: async () => undefined,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assert.equal(onRefineSuccess.mock.calls.length, 1);

    unmount();
  });

  it("onRefineError is called when refiner fails", async () => {
    let strongForm: AnyStrongForm | undefined;

    const onRefineError = vi.fn();
    const error = new Error("nope");

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "ok" })),
          refiner: async () => {
            throw error;
          },
          onRefineError,
          submitor: async () => undefined,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assert.equal(onRefineError.mock.calls.length, 1);
    assert.equal(onRefineError.mock.calls[0]?.[0], error);

    unmount();
  });

  it("getFieldState reports required=false when validator has no required", async () => {
    let strongForm: AnyStrongForm | undefined;

    const validators: Record<keyof Inputs, Validator> = {
      name: { url: true },
    };

    const { unmount } = render(
      React.createElement(function Harness() {
        strongForm = useStrongForm<
          Inputs,
          Inputs,
          Error,
          unknown,
          Error,
          unknown
        >({
          inputs: useConst(() => ({ name: "" })),
          validators,
          submitor: async () => undefined,
        });
        return React.createElement("div");
      })
    );

    await act(async () => {
      await flushMicrotasks();
    });

    assertAssigned(strongForm);
    assert.equal(strongForm.getFieldState("name").isRequired, false);

    unmount();
  });
});
