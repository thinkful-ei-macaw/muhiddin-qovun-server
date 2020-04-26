const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Posts Endpoints', function() {
  let db;

  const {
    testUsers,
    testPosts,
  } = helpers.makePostsFixtures(); 

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/posts', () => {
    context('Given no posts', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/posts')
          .expect(200, []);
      });
    });

    context('Given there are posts in the database', () => {
      beforeEach('insert posts', () =>
        helpers.seedPostsTables(  // here
          db,
          testUsers,
          testPosts
        )
      );

      it('responds with 200 and all of the posts', () => {
        const expectedPosts = testPosts.map(post =>
          helpers.makeExpectedPost(
            testUsers,
            post
          )
        );
        return supertest(app)
          .get('/api/posts')
          .expect(200, expectedPosts);
      });
    });

    context('Given an XSS attack post', () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousPost,
        expectedPost,
      } = helpers.makeMaliciousPost(testUser);

      beforeEach('insert malicious post', () => {
        return helpers.seedMaliciousPost(
          db,
          testUser,
          maliciousPost
        );
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/posts')
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedPost.title);
            expect(res.body[0].content).to.eql(expectedPost.content);
          });
      });
    });
  });
});