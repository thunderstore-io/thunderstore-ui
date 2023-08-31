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
