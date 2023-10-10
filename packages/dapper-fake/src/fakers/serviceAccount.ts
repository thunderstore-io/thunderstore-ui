import { faker } from "@faker-js/faker";

import { getIds, setSeed } from "./utils";

export const getFakeServiceAccount = async (serviceAccountId?: string) => {
  setSeed(serviceAccountId);

  return {
    name: faker.internet.userName(),
    lastUsed: faker.date.recent({ days: 700 }).toDateString(),
  };
};

export const getFakeServiceAccounts = () =>
  Promise.all(getIds(5).map(getFakeServiceAccount));

export const getFakeTempServiceAccount = async (serviceAccountId?: string) => {
  setSeed(serviceAccountId);

  return {
    identifier: faker.string.uuid(),
    name: faker.internet.userName(),
    last_used:
      faker.helpers.maybe(() =>
        faker.date.recent({ days: 700 }).toDateString()
      ) ?? null,
  };
};

export const getFakeTempServiceAccounts = () =>
  Promise.all(getIds(5).map(getFakeTempServiceAccount));
