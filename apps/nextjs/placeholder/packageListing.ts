export const fakeCategories = [
  { slug: "items", name: "Items" },
  { slug: "tweaks", name: "Tweaks" },
  { slug: "mods", name: "Mods" },
  { slug: "tools", name: "Tools" },
  { slug: "maps", name: "Maps" },
  { slug: "skins", name: "Skins" },
  { slug: "audio", name: "Audio" },
  { slug: "player-characters", name: "Player Characters" },
  { slug: "client-side", name: "Client-side" },
  { slug: "server-side", name: "Server-side" },
  { slug: "language", name: "Language" },
];

export const fakeData = [
  ...Array(30)
    .fill(0)
    .map((_x, i) => ({
      categories:
        i % 4 === 0
          ? [
              { slug: "items", name: "Items" },
              { slug: "tweaks", name: "Tweaks" },
              { slug: "mods", name: "Mods" },
            ]
          : i % 4 === 1
          ? [
              { slug: "items", name: "Items" },
              { slug: "tweaks", name: "Tweaks" },
            ]
          : i % 4 === 2
          ? [{ slug: "items", name: "Items" }]
          : [],
      description:
        "Adds item drop on killing the Shopkeeper, and several new items.",
      download_count: 40,
      image_src:
        i === 0 || i % 5
          ? "https://api.lorem.space/image/game?w=266&h=200"
          : null,
      is_deprecated: i !== 0 && i % 8 === 0,
      is_nsfw: i !== 0 && i % 6 === 0,
      is_pinned: i < 3,
      last_updated: "2021-12-17T15:00:00Z",
      rating_score: 600,
      package_name: "NewtDrop",
      team_name: "BoneCapTheTweet",
    })),
];
