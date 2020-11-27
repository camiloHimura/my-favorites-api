const request = require("supertest");
const App = require("../../index");
const db = require("../db");
const { router, CrudModel } = require("./router");
const { SAVED, REMOVED, UPDATED } = require("../../routes/constants");
const dropAllCollections = require("../test/dropAllCollections");
const inserManyDocs = require("../test/inserManyDocs");

App.use("/genericCrud", router);
let newDocs;
const numDocs = 5;
const errorObj = { error: true, messaje: expect.any(String) };

beforeAll(async () => {
  await db.connect();
  newDocs = await inserManyDocs(CrudModel, numDocs, { title: "title test" });
});

afterAll(async () => {
  await dropAllCollections();
  await db.close();
});

test("create", async () => {
  const data = { title: "crud create doc test" };
  const response = await request(App)
    .post("/genericCrud/create")
    .send(data)
    .expect(201);

  expect(response.body.data).not.toBeNull();
  expect(response.body.status).toBe(SAVED);
  expect(response.body.data.title).toBe(response.body.data.title);
});

test("find all", async () => {
  const response = await request(App)
    .get("/genericCrud/findAll")
    .send()
    .expect(200);

  expect(response.body.length).toBeGreaterThanOrEqual(numDocs);
  [...newDocs].forEach((info) => {
    expect(
      response.body.some((data) => String(data._id) === String(info._id))
    ).toBe(true);
  });
});

test("findOne", async () => {
  const data = {
    __v: newDocs[0].__v,
    _id: String(newDocs[0]._id),
    title: newDocs[0].title,
  };

  const response = await request(App)
    .get(`/genericCrud/findOne/${data._id}`)
    .send()
    .expect(200);

  expect(response.body).toBeTruthy();
  expect(response.body).toEqual(data);
});

test("findOne invalid ID", async () => {
  const response = await request(App)
    .get(`/genericCrud/findOne/000`)
    .send()
    .expect(404);

  expect(response.body).toMatchObject(errorObj);
});

test("findAndUpdate, valid Id", async () => {
  const data = {
    __v: newDocs[1].__v,
    _id: String(newDocs[1]._id),
    title: newDocs[1].title,
  };

  const newTitle = "new crud test";
  const response = await request(App)
    .post(`/genericCrud/findAndUpdate/${data._id}`)
    .send({ title: newTitle })
    .expect(200);

  expect(response.body.status).toBe(UPDATED);
  expect(response.body.data).not.toBeNull();
  expect(response.body.data.title).toBe(newTitle);
});

test("findAndUpdate, invalid ID", async () => {
  const response = await request(App)
    .post(`/genericCrud/findAndUpdate/000`)
    .send()
    .expect(404);

  expect(response.body).toEqual(errorObj);
});

test("findAndremove ", async () => {
  const _id = newDocs[2]._id;
  const response = await request(App)
    .get(`/genericCrud/findAndremove/${_id}`)
    .send()
    .expect(200);

  const doc = await CrudModel.findOne({ _id });
  expect(response.body.status).toBe(REMOVED);
  expect(doc).toBeNull();
});

test("findAndremove invalid ID", async () => {
  const response = await request(App)
    .get(`/genericCrud/findAndremove/000`)
    .send()
    .expect(404);

  expect(response.body).toEqual(errorObj);
});
