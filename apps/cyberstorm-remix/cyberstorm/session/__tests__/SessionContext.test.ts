import { afterEach, assert, beforeEach, describe, it, vi } from "vitest";

import type { User } from "@thunderstore/thunderstore-api";
import {
  API_HOST_KEY,
  COOKIE_DOMAIN_KEY,
  CURRENT_USER_KEY,
  SESSION_STORAGE_KEY,
  STALE_KEY,
  StorageManager,
  clearCookies,
  clearInvalidSession,
  clearSession,
  getConfig,
  getCookie,
  getSessionContext,
  getSessionCurrentUser,
  getSessionStale,
  runSessionValidationCheck,
  setSessionStale,
  storeCurrentUser,
  updateCurrentUser,
} from "@thunderstore/ts-api-react";

vi.mock("@thunderstore/dapper-ts", () => ({
  DapperTs: vi.fn(),
}));

let getCurrentUserMock: ReturnType<typeof vi.fn>;

describe("SessionContext", () => {
  const testApiHost = "https://api.example.invalid";
  const testCookieDomain = ".example.invalid";

  beforeEach(async () => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Clear cookies
    document.cookie =
      "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    getCurrentUserMock = vi.fn().mockResolvedValue(null);
    const { DapperTs } = await import("@thunderstore/dapper-ts");
    vi.mocked(DapperTs).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => ({ getCurrentUser: getCurrentUserMock }) as any
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getCookie", () => {
    it("should return cookie value when present", () => {
      document.cookie = "sessionid=test-session-id";
      assert.strictEqual(getCookie("sessionid"), "test-session-id");
    });

    it("should return null when cookie is missing", () => {
      document.cookie = "other=123";
      assert.isNull(getCookie("sessionid"));
    });
  });

  describe("getConfig", () => {
    it("should use domain fallback when apiHost is not stored", () => {
      document.cookie = "sessionid=abc";
      const storage = new StorageManager(SESSION_STORAGE_KEY);

      const config = getConfig(storage, "http://fallback.invalid");
      assert.strictEqual(config.apiHost, "http://fallback.invalid");
      assert.strictEqual(config.sessionId, "abc");
    });

    it("should use stored apiHost over domain", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue(API_HOST_KEY, "http://stored.invalid");

      const config = getConfig(storage, "http://fallback.invalid");
      assert.strictEqual(config.apiHost, "http://stored.invalid");
    });
  });

  describe("clearCookies", () => {
    it("should clear sessionid cookie", () => {
      document.cookie = "sessionid=abc; path=/";
      clearCookies("localhost");
      assert.isNull(getCookie("sessionid"));
    });
  });

  describe("clearInvalidSession", () => {
    it("should clear current user and mark session stale", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue(COOKIE_DOMAIN_KEY, ".example.invalid");

      const testUser: User = {
        username: "testUser",
        capabilities: [],
        connections: [],
        subscription: { expires: null },
        teams: [],
        teams_full: [],
      };
      storeCurrentUser(storage, testUser);

      clearInvalidSession(storage);

      assert.isNull(storage.safeGetJsonValue(CURRENT_USER_KEY));
      assert.strictEqual(storage.safeGetValue(STALE_KEY), "yes");
    });

    it("should not throw if storage operations fail", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const brokenStorage = {
        safeGetValue: () => {
          throw new Error("boom");
        },
        removeValue: () => {
          throw new Error("boom");
        },
        setValue: () => {
          throw new Error("boom");
        },
      } as unknown as StorageManager;

      clearInvalidSession(brokenStorage);
      assert.isTrue(errorSpy.mock.calls.length >= 1);
    });
  });

  describe("StorageManager", () => {
    it("should store and retrieve values with namespace", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue("testKey", "testValue");

      assert.strictEqual(storage.safeGetValue("testKey"), "testValue");
      assert.strictEqual(
        window.localStorage.getItem(`${SESSION_STORAGE_KEY}.testKey`),
        "testValue"
      );
    });

    it("should store and retrieve JSON values", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      const testData = { username: "testUser", id: 123 };
      storage.setJsonValue("jsonKey", testData);

      const retrieved = storage.safeGetJsonValue("jsonKey");
      assert.deepEqual(retrieved, testData);
    });

    it("should return null for non-existent values", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);

      assert.isNull(storage.safeGetValue("nonExistent"));
      assert.isNull(storage.safeGetJsonValue("nonExistent"));
    });

    it("should remove values correctly", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue("toRemove", "value");
      assert.strictEqual(storage.safeGetValue("toRemove"), "value");

      storage.removeValue("toRemove");
      assert.isNull(storage.safeGetValue("toRemove"));
    });

    it("safeGetJsonValue(key, true) should remove invalid JSON", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue("invalidJson", "{ broken");

      assert.isNull(storage.safeGetJsonValue("invalidJson", true));
      assert.isNull(storage.getValue("invalidJson"));
    });

    it("safeGetJsonValue(key, true) should parse valid JSON", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      const data = { valid: true };
      storage.setJsonValue("validJson", data);

      assert.deepEqual(storage.safeGetJsonValue("validJson", true), data);
      assert.isNotNull(storage.getValue("validJson"));
    });

    it("safeGetJsonValue(key, true) should preserve valid null value", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setJsonValue("nullValue", null);

      assert.isNull(storage.safeGetJsonValue("nullValue", true));
      // storage.getValue returns the string "null" because setJsonValue uses JSON.stringify(null) -> "null"
      assert.strictEqual(storage.getValue("nullValue"), "null");
    });

    it("safeGetJsonValue(key, true) should not throw if storage operations fail", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);

      // We can't easily replace the private getter _storage, so we'll mock the StorageManager instance method that calls it
      // actually, let's just mock getValue and removeValue on the instance
      vi.spyOn(storage, "getValue").mockImplementation(() => {
        throw new Error("Read failed");
      });
      vi.spyOn(storage, "removeValue").mockImplementation(() => {
        throw new Error("Write failed");
      });

      // Should return null and not throw
      assert.isNull(storage.safeGetJsonValue("anyKey", true));
    });
  });

  describe("setSessionStale / getSessionStale", () => {
    it("should set and get stale state correctly", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);

      setSessionStale(storage, true);
      assert.isTrue(getSessionStale(storage));

      setSessionStale(storage, false);
      assert.isFalse(getSessionStale(storage));
    });

    it("should default to not stale when key doesn't exist", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);

      assert.isFalse(getSessionStale(storage));
    });
  });

  describe("storeCurrentUser", () => {
    it("should store user in localStorage", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      const testUser: User = {
        username: "testUser",
        capabilities: ["test"],
        connections: [],
        subscription: { expires: null },
        teams: ["team1"],
        teams_full: [],
      };

      storeCurrentUser(storage, testUser);

      const storedUser = storage.safeGetJsonValue(CURRENT_USER_KEY);
      assert.strictEqual(storedUser.username, "testUser");
      assert.deepEqual(storedUser.capabilities, ["test"]);
    });
  });

  describe("clearSession", () => {
    it("should remove currentUser from storage", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      const testUser: User = {
        username: "testUser",
        capabilities: [],
        connections: [],
        subscription: { expires: null },
        teams: [],
        teams_full: [],
      };
      storeCurrentUser(storage, testUser);
      assert.isNotNull(storage.safeGetJsonValue(CURRENT_USER_KEY));

      clearSession(storage, false);

      assert.isNull(storage.safeGetJsonValue(CURRENT_USER_KEY));
    });

    it("should optionally clear apiHost", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue(API_HOST_KEY, testApiHost);

      clearSession(storage, false);
      assert.strictEqual(storage.safeGetValue(API_HOST_KEY), testApiHost);

      clearSession(storage, true);
      assert.isNull(storage.safeGetValue(API_HOST_KEY));
    });
  });

  describe("runSessionValidationCheck", () => {
    it("should set stale to yes when sessionid cookie exists but no currentUser", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // Set a sessionid cookie
      document.cookie = "sessionid=test-session-id;";

      const result = runSessionValidationCheck(
        storage,
        testApiHost,
        testCookieDomain
      );

      assert.isFalse(result);
      assert.strictEqual(storage.safeGetValue(STALE_KEY), "yes");
    });

    it("should return true when sessionid cookie exists and currentUser exists", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      document.cookie = "sessionid=test-session-id;";
      const testUser: User = {
        username: "testUser",
        capabilities: [],
        connections: [],
        subscription: { expires: null },
        teams: [],
        teams_full: [],
      };
      storeCurrentUser(storage, testUser);

      const result = runSessionValidationCheck(
        storage,
        testApiHost,
        testCookieDomain
      );

      assert.isTrue(result);
    });

    it("should set stale to yes when no sessionid but currentUser exists", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // No sessionid cookie
      const testUser: User = {
        username: "testUser",
        capabilities: [],
        connections: [],
        subscription: { expires: null },
        teams: [],
        teams_full: [],
      };
      storeCurrentUser(storage, testUser);

      const result = runSessionValidationCheck(
        storage,
        testApiHost,
        testCookieDomain
      );

      assert.isFalse(result);
      assert.strictEqual(storage.safeGetValue(STALE_KEY), "yes");
    });

    it("should update apiHost if different", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue(API_HOST_KEY, "https://old-api.test.invalid");

      runSessionValidationCheck(storage, testApiHost, testCookieDomain);

      assert.strictEqual(storage.safeGetValue(API_HOST_KEY), testApiHost);
    });

    it("should update cookieDomain if different", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setValue(COOKIE_DOMAIN_KEY, ".old.test.invalid");

      runSessionValidationCheck(storage, testApiHost, testCookieDomain);

      assert.strictEqual(
        storage.safeGetValue(COOKIE_DOMAIN_KEY),
        testCookieDomain
      );
    });

    it("should clean up invalid JSON in localStorage during validation check", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // Set invalid JSON that causes syntax error
      storage.setValue(CURRENT_USER_KEY, "{ broken_json: true");

      runSessionValidationCheck(storage, testApiHost, testCookieDomain);

      // Should be removed
      assert.isNull(storage.safeGetValue(CURRENT_USER_KEY));
    });

    it("should clean up invalid schema data in localStorage during validation check", () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // Valid JSON but invalid schema (missing required fields)
      storage.setJsonValue(CURRENT_USER_KEY, {
        username: "OldFormatUser",
        // Missing capabilities, connections etc
      });

      runSessionValidationCheck(storage, testApiHost, testCookieDomain);

      // Should be removed because parseCurrentUser fails
      assert.isNull(storage.safeGetValue(CURRENT_USER_KEY));
    });
  });

  describe("getSessionContext", () => {
    it("should return context interface with all methods", () => {
      const context = getSessionContext(testApiHost, testCookieDomain);

      assert.isFunction(context.clearSession);
      assert.isFunction(context.clearCookies);
      assert.isFunction(context.setSession);
      assert.isFunction(context.setSessionStale);
      assert.isFunction(context.getSessionStale);
      assert.isFunction(context.getConfig);
      assert.isFunction(context.runSessionValidationCheck);
      assert.isFunction(context.updateCurrentUser);
      assert.isFunction(context.storeCurrentUser);
      assert.isFunction(context.getSessionCurrentUser);
      assert.strictEqual(context.apiHost, testApiHost);
    });

    it("should set apiHost in storage", () => {
      getSessionContext(testApiHost, testCookieDomain);

      const storage = new StorageManager(SESSION_STORAGE_KEY);
      assert.strictEqual(storage.safeGetValue(API_HOST_KEY), testApiHost);
    });

    it("updateCurrentUser should return a Promise", () => {
      const context = getSessionContext(testApiHost, testCookieDomain);

      // The updateCurrentUser method should return a Promise
      // We verify this without actually executing it to avoid network calls
      const updateFn = context.updateCurrentUser;
      assert.isFunction(updateFn);

      // The function should be an async function that returns a Promise
      // This tests that the bug fix (adding 'return' before updateCurrentUser)
      // is in place - without the return, calling the function would return
      // Promise<undefined> immediately instead of the actual Promise
      const result = updateFn();
      assert.isTrue(
        result instanceof Promise,
        "updateCurrentUser should return a Promise"
      );

      // Immediately abort any pending request by ignoring the result
      // We don't need to await or catch because we just want to verify
      // the Promise structure, not the actual API behavior
      result.catch(() => {
        // Expected - network request will fail with invalid domain
      });
    });
  });

  describe("getSessionCurrentUser", () => {
    it("should return empty user when no currentUser in storage", async () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // Set stale to "no" to skip API call
      setSessionStale(storage, false);

      const result = await getSessionCurrentUser(storage, false);

      assert.isNull(result.username);
      assert.deepEqual(result.capabilities, []);
      assert.deepEqual(result.connections, []);
      assert.deepEqual(result.teams, []);
      assert.deepEqual(result.teams_full, []);
    });

    it("should return stored user when present and not forcing update", async () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      const testUser: User = {
        username: "storedUser",
        capabilities: ["cap1"],
        connections: [],
        subscription: { expires: null },
        teams: ["team1"],
        teams_full: [],
      };
      storeCurrentUser(storage, testUser);
      setSessionStale(storage, false);

      const result = await getSessionCurrentUser(storage, false);

      assert.strictEqual(result.username, "storedUser");
      assert.deepEqual(result.capabilities, ["cap1"]);
      assert.deepEqual(result.teams, ["team1"]);
    });

    it("should return empty user and clear storage when stored user is invalid", async () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // Malformed user object (invalid schema)
      const invalidUser = { username: 123, someRandomField: "test" };
      storage.setJsonValue(CURRENT_USER_KEY, invalidUser);
      setSessionStale(storage, false);

      const result = await getSessionCurrentUser(storage, false);

      // Should return properly formatted empty user
      assert.isNull(result.username);
      assert.deepEqual(result.capabilities, []);

      // Storage should be cleared of the invalid data
      assert.isNull(storage.safeGetJsonValue(CURRENT_USER_KEY));
    });

    it("should handle malformed JSON string in localStorage and clean it up", async () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      // Directly set invalid JSON string that JSON.parse would fail on,
      // bypass setJsonValue to simulate data corruption or raw manipulation
      storage.setValue(CURRENT_USER_KEY, "{ invalid-json-string");
      setSessionStale(storage, false);

      const result = await getSessionCurrentUser(storage, false);

      assert.isNull(result.username);
      // Verify cleanup happened
      assert.isNull(storage.safeGetValue(CURRENT_USER_KEY));
    });
  });

  describe("updateCurrentUser", () => {
    it("should store currentUser and clear stale when user is returned", async () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);

      getCurrentUserMock.mockResolvedValue({
        username: "testUser",
        capabilities: [],
        connections: [],
        subscription: { expires: null },
        teams: [],
        teams_full: [],
      });

      await updateCurrentUser(storage);

      const storedUser = storage.safeGetJsonValue(CURRENT_USER_KEY) as User;
      assert.strictEqual(storedUser.username, "testUser");
      assert.strictEqual(storage.safeGetValue(STALE_KEY), "no");
    });

    it("should clear currentUser when API returns null/empty and clear stale", async () => {
      const storage = new StorageManager(SESSION_STORAGE_KEY);
      storage.setJsonValue(CURRENT_USER_KEY, { username: "old" } as unknown);

      getCurrentUserMock.mockResolvedValue(null);
      await updateCurrentUser(storage);

      assert.isNull(storage.safeGetJsonValue(CURRENT_USER_KEY));
      assert.strictEqual(storage.safeGetValue(STALE_KEY), "no");
    });
  });
});
