const request = require("supertest");
const App = require("../../../index");
const db = require("../../../utils/db");
const { SAVED } = require("../../constants");
const TagModel = require("../../tag/tag.model");
const inserManyDocs = require("../../../utils/test/inserManyDocs");
const dropAllCollections = require("../../../utils/test/dropAllCollections");
let tagsDocs = [];

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.close();
});

beforeEach(async () => {
  await dropAllCollections();
});

afterEach(async () => {
  await dropAllCollections();
});

test("new links is saved, code 200", async () => {
  const response = await request(App)
    .put("/api/link")
    .send({
      url: "https://my-links-frontend.herokuapp.com/1",
      title: "link test 1",
      tags: [],
    })
    .expect(200);

  expect(response.body.status).toBe(SAVED);
});

test("link formated", async () => {
  const response = await request(App)
    .put("/api/link")
    .send({
      url: "https://my-links-frontend.herokuapp.com/3",
      title: "link test 3",
      tags: [],
    })
    .expect(200);

  expect(response.body.data).toEqual({
    title: "link test 3",
    id: expect.any(String),
    tags: expect.any(Array),
    url: "https://my-links-frontend.herokuapp.com/3",
  });
});

test("tags array is populated", async () => {
  tagsDocs = await inserManyDocs(TagModel, 1, {
    name: `tag test`,
    color: "2B4F7F",
  });

  const response = await request(App)
    .put("/api/link")
    .send({
      url: "https://my-links-frontend.herokuapp.com/4",
      title: "link test 4",
      tags: [String(tagsDocs[0]._id)],
    })
    .expect(200);

  expect(response.body.data.tags[0]).toEqual({
    name: tagsDocs[0].name,
    color: tagsDocs[0].color,
    id: String(tagsDocs[0]._id),
  });
});
