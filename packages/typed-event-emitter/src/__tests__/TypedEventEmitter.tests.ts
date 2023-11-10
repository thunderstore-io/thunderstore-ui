import { expect } from "@jest/globals";
import { TypedEventEmitter, TypedListener } from "../TypedEventEmitter";

describe("TypedEventEmitter", () => {
  interface TestEvent {
    message: string;
  }

  const createAsyncListener = (
    receivedEvents: TestEvent[]
  ): TypedListener<TestEvent> => {
    return async (event: TestEvent) => {
      receivedEvents.push(event);
    };
  };

  const createSyncListener = (
    receivedEvents: TestEvent[]
  ): TypedListener<TestEvent> => {
    return (event: TestEvent) => {
      receivedEvents.push(event);
    };
  };

  let eventEmitter: TypedEventEmitter<TestEvent>;

  beforeEach(() => {
    eventEmitter = new TypedEventEmitter<TestEvent>();
  });

  it("should emit events to active listeners only", async () => {
    const receivedEvents1: TestEvent[] = [];
    const receivedEvents2: TestEvent[] = [];

    const listener1 = createAsyncListener(receivedEvents1);
    const listener2 = createSyncListener(receivedEvents2);

    const unsub1 = eventEmitter.addListener(listener1);
    eventEmitter.addListener(listener2);

    const testEvent: TestEvent = { message: "Hello, World!" };
    await eventEmitter.emit(testEvent);

    expect(receivedEvents1).toEqual([testEvent]);
    expect(receivedEvents2).toEqual([testEvent]);

    unsub1();

    const testEvent2: TestEvent = { message: "Hello again, World!" };
    await eventEmitter.emit(testEvent2);

    expect(receivedEvents1).toEqual([testEvent]);
    expect(receivedEvents2).toEqual([testEvent, testEvent2]);
  });

  it("should handle empty listeners", async () => {
    await expect(eventEmitter.emit({ message: "Test" })).resolves.not.toThrow();
  });

  it("should provide an unsubscribe callback", () => {
    expect(eventEmitter.listenerCount).toEqual(0);
    const unsub = eventEmitter.addListener(() => {});
    expect(eventEmitter.listenerCount).toEqual(1);
    unsub();
    expect(eventEmitter.listenerCount).toEqual(0);
  });

  it("should handle sync listeners", () => {
    const receivedEvents: TestEvent[] = [];

    const listener = createSyncListener(receivedEvents);

    eventEmitter.addListener(listener);

    const testEvent: TestEvent = { message: "Hello, World!" };
    eventEmitter.emit(testEvent);

    expect(receivedEvents).toEqual([testEvent]);
  });

  it("should handle async listeners", async () => {
    const receivedEvents: TestEvent[] = [];

    const listener = createAsyncListener(receivedEvents);

    eventEmitter.addListener(listener);

    const testEvent: TestEvent = { message: "Hello, World!" };
    await eventEmitter.emit(testEvent);

    expect(receivedEvents).toEqual([testEvent]);
  });
});
