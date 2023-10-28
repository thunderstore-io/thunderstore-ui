it("runs", async () => {
  await expect(Promise.resolve("test")).resolves.not.toThrowError();
});
