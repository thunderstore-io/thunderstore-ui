import { faker } from "@faker-js/faker";

export const getFakeImg = (width = 525, height = 525, category = "abstract") =>
  faker.image.urlLoremFlickr({ width, height, category });

export const getFakeLink = () => ({
  title: faker.word.sample(),
  url: faker.internet.url(),
});

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
