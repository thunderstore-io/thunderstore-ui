# @thunderstore/typed-event-emitter

A lightweight, strongly-typed event emitter implementation.

## Features

-   **Type Safety**: Events and their payloads are fully typed via TypeScript generics.
-   **Minimal API**: Simple `on`, `off`, and `emit` methods.
-   **No Dependencies**: Zero runtime dependencies.

## Usage

```typescript
import { TypedEventEmitter } from "@thunderstore/typed-event-emitter";

type MyEvents = {
  "user-login": { userId: string };
  "data-loaded": void;
};

const emitter = new TypedEventEmitter<MyEvents>();

emitter.on("user-login", ({ userId }) => {
  console.log(`User ${userId} logged in`);
});

emitter.emit("user-login", { userId: "123" });
```

## Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild
