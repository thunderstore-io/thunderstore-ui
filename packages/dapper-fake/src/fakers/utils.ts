import { faker } from "@faker-js/faker";

export const getFakeImg = (width = 525, height = 525, category = "abstract") =>
  faker.image.urlLoremFlickr({ width, height, category });

export const getFakeLink = () => ({
  title: faker.word.sample(),
  url: faker.internet.url(),
});

export const getFakePackageCategories = (returnAmount?: number) => {
  const categories = [
    { id: 1, name: "Mods", slug: "mods" },
    { id: 2, name: "Tools", slug: "tools" },
    { id: 3, name: "Libraries", slug: "libraries" },
    { id: 4, name: "Modpacks", slug: "modpacks" },
    { id: 5, name: "Skins", slug: "skins" },
    { id: 6, name: "Maps", slug: "maps" },
    { id: 7, name: "Tweaks", slug: "tweaks" },
    { id: 8, name: "Items", slug: "items" },
    { id: 9, name: "Language", slug: "language" },
    { id: 10, name: "Audio", slug: "audio" },
    { id: 11, name: "Enemies", slug: "enemies" },
  ];

  return faker.helpers.arrayElements(categories, {
    min: 0,
    max: returnAmount ?? 3,
  });
};

export const getFakeSections = (returnAmount?: number) => {
  const categories = [
    { uuid: faker.string.uuid(), name: "Mods", slug: "mods", priority: 0 },
    {
      uuid: faker.string.uuid(),
      name: "Modpacks",
      slug: "modpacks",
      priority: 1,
    },
    { uuid: faker.string.uuid(), name: "Maps", slug: "maps", priority: 2 },
    {
      uuid: faker.string.uuid(),
      name: "Custom cards",
      slug: "cards",
      priority: 3,
    },
    {
      uuid: faker.string.uuid(),
      name: "Latest update",
      slug: "update",
      priority: 4,
    },
    { uuid: faker.string.uuid(), name: "Paid DLC", slug: "dlc", priority: 5 },
  ];

  return faker.helpers.arrayElements(categories, {
    min: faker.helpers.maybe(() => 2) ?? 0, // Don't return just 1 section.
    max: returnAmount ?? 2,
  });
};

export const getIds = (count: number, seed?: string) => {
  setSeed(seed);

  return range(count).map(faker.string.uuid);
};

export const range = (count: number) => Array.from(Array(count).keys());

/**
 * Set faker's seed to provide consistent results.
 */
export const setSeed = (seed: string | number = 1337) => {
  const _seed = typeof seed === "string" ? strToHashInt(seed) : seed;
  faker.seed(_seed);
};

const strToHashInt = (inputString: string) => {
  return inputString
    ? inputString.split("").reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    : 0;
};
