import { StorageManager } from "utils/storage";

describe("StorageManager", () => {
  it.each(["ns", "", undefined])(
    "works when namespace is %p",
    (namespace: string | undefined) => {
      const storage = new StorageManager(namespace);
      const key = "key";
      const value = "Valheim";

      storage.setValue(key, value);
      const actual = storage.getValue(key);

      expect(actual).toStrictEqual(value);
    }
  );

  it("respects namespaces", () => {
    const storage1 = new StorageManager("alpha");
    const storage2 = new StorageManager("beta");
    const storage3 = new StorageManager("Alpha");
    const key = "key";
    const value = "Risk of Rain 2";

    storage1.setValue(key, value);
    const actual1 = storage1.getValue(key);
    const actual2 = storage2.getValue(key);
    const actual3 = storage3.getValue(key);

    expect(actual1).toStrictEqual(value);
    expect(actual2).toBeNull();
    expect(actual3).toBeNull();
  });

  it("respects keys", () => {
    const storage = new StorageManager("TS");
    const key1 = "key1";
    const key2 = "key2";
    const value1 = "Outward";
    const value2 = "TaleSpire";

    storage.setValue(key1, value1);
    storage.setValue(key2, value2);
    const actual1 = storage.getValue(key1);
    const actual2 = storage.getValue(key2);

    expect(actual1).toStrictEqual(value1);
    expect(actual2).toStrictEqual(value2);
  });

  it("getValue doesn't remove value", () => {
    const storage = new StorageManager("TS");
    const key = "key";
    const value = "Baldur's Gate 3";

    storage.setValue(key, value);
    const actual1 = storage.getValue(key);
    const actual2 = storage.getValue(key);

    expect(actual1).toStrictEqual(value);
    expect(actual2).toStrictEqual(value);
  });

  it("popValue removes value", () => {
    const storage = new StorageManager("TS");
    const key = "key";
    const value = "For the King";

    storage.setValue(key, value);
    const actual1 = storage.popValue(key);
    const actual2 = storage.popValue(key);

    expect(actual1).toStrictEqual(value);
    expect(actual2).toBeNull();
  });

  it("removeValue removes value", () => {
    const storage = new StorageManager("TS");
    const key = "key";
    const value = "Timberborn";

    storage.setValue(key, value);
    const actual1 = storage.popValue(key);
    storage.removeValue(key);
    const actual2 = storage.popValue(key);

    expect(actual1).toStrictEqual(value);
    expect(actual2).toBeNull();
  });
});
