const request = require('supertest');
const App = require('../../index');
const db = require('../../utils/db');

beforeEach(async () => {
  await db.connect();
})

test('get all the link', async () => {
  await request(App).get('/api/link')
          .send()
          .expect(200)
})