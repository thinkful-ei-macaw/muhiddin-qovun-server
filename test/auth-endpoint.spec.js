const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const knex = require('knex');


describe('Auth Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const [testUser] = testUsers;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  /**
   * @description Get token for login
   **/
  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'invalid username or password' when bad username`, () => {
      const userInvalidUser = { user_name: 'user-not', password: 'existy' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect username or password` })
    })

    it(`responds 400 'invalid username or password' when bad password`, () => {
      const userInvalidPass = { user_name: testUser.user_name, password: 'incorrect' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect username or password` })
    })  

  })
})