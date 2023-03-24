import { faker } from "@faker-js/faker";
import { CommunityPreview, PackagePreview } from "../schema";

export function getListOfIds(length: number, seed?: number) {
  faker.seed(seed ? seed : 1337);
  return faker.datatype.array(length).map((element) => {
    return element.toString();
  });
}

export function getCommunityPreviewDummyData(seed?: number): CommunityPreview {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    packageCount: faker.datatype.number({ min: 0, max: 100000 }),
    serverCount: faker.datatype.number({ min: 0, max: 1000 }),
    imageSource: faker.image.abstract(300, 450, true),
  };
}

export function getPackagePreviewDummyData(seed?: number): PackagePreview {
  faker.seed(seed ? seed : 1337);
  return {
    name: faker.random.words(3),
    namespace: "namespace",
    description: faker.company.bs(),
    imageSource: faker.image.abstract(525, 525, true),
    downloadCount: faker.datatype.number({ min: 1000000, max: 10000000 }),
    likes: faker.datatype.number({ min: 0, max: 100000 }),
    size: faker.datatype.number({ min: 20000, max: 10000000 }),
    author: faker.name.fullName(),
    lastUpdated: faker.date.recent(700).toDateString(),
    isPinned: faker.datatype.boolean(),
    isNsfw: faker.datatype.boolean(),
    isDeprecated: faker.datatype.boolean(),
    categories: [faker.word.noun(), faker.word.noun(), faker.word.noun()],
  };
}
