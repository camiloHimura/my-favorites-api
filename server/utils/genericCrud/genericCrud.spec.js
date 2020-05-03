const request = require('supertest');
const mongoose = require("mongoose");
const App = require('../../index');
const db = require('../db');
const {router, CrudModel} = require('./router');

App.use("/genericCrud", router);
let numDocs;
let ids;
const errorObj = {error: true, messaje: expect.any(String)}

beforeAll(async () => {
  console.log('------ beforeAll ------')
  await db.connect();
  console.log('------ beforeAll Done ------')
});

afterAll(async () => {
  console.log('------ afterAll ------')
  await db.close();
  console.log('------ afterAll Done ------')
});

beforeEach(async () => {
  numDocs = 5;
  await CrudModel.deleteMany();
  ids = await inserManyDocs(numDocs);
})

test('create', async () => {
  console.log('-- create --')
  const data = { title: 'crud create doc test'};
  const response = await request(App).post('/genericCrud/create').send(data).expect(201);
  
  expect(response.body.data).not.toBeNull();
  expect(response.body.status).toBe('saved')
  expect(response.body.data.title).toBe(response.body.data.title)
})

test('find all', async () => {
  console.log('-- find all --')
  const response = await request(App).get('/genericCrud/findAll')
  .send()
  .expect(200)
  expect(response.body.length).toBe(numDocs)
})

test('findOne', async () => {
  console.log('-- find one --')

  const response = await request(App).get(`/genericCrud/findOne/${ids[numDocs - 1]}`)
                    .send()
                    .expect(200)

  expect(response.body.data).not.toBeNull()
})

test('findOne invalid ID', async () => {
  console.log('-- findOne invalid ID --')

  const response = await request(App).get(`/genericCrud/findOne/000`)
                    .send()
                    .expect(404)

  expect(response.body).toMatchObject(errorObj)
})

test('findAndUpdate', async () => {
  console.log('-- findAndUpdate --')
  const newTitle = 'new crud test';
  const response = await request(App).post(`/genericCrud/findAndUpdate/${ids[numDocs - 1]}`)
                    .send({ title: newTitle})
                    .expect(200)

  expect(response.body.status).toBe('updated')
  expect(response.body.data).not.toBeNull()
  expect(response.body.data.title).toBe(newTitle)

})

test('findAndUpdate invalid ID', async () => {
  console.log('-- findOne invalid ID --')

  const response = await request(App).post(`/genericCrud/findAndUpdate/000`)
                    .send()
                    .expect(404)

  expect(response.body).toEqual(errorObj)
})

test('findAndremove ', async () => {
  console.log('-- findAndremove --')
  await request(App).get(`/genericCrud/findAndremove/${ids[0]}`)
          .send()
          .expect(200)
})

test('findAndremove invalid ID', async () => {
  console.log('-- findAndremove --')
  const response = await request(App).get(`/genericCrud/findAndremove/000`)
                    .send()
                    .expect(404);
  
  expect(response.body).toEqual(errorObj)
})

function inserManyDocs(length) {
  const ids = [];

  return Promise.all(Array.from({length}, (_, index) => {
    const id = new mongoose.Types.ObjectId();
    ids.push(id);
    return CrudModel.create({_id: id, title: `test ${index}` })
  }))
  .then(() => ids)
}
