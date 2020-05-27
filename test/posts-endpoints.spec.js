const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Posts Endpoints', function () {
  let db;

  const { testUsers, testPosts } = helpers.makePostsFixtures();
  const [testUser] = testUsers;

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
  // GET testing
  describe('GET /api/posts', () => {
    context('Given no posts', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/posts').expect(200, []);
      });
    });

    context('Given there are posts in the database', () => {
      beforeEach('insert posts', () =>
        helpers.seedPostsTables(
          // here
          db,
          testUsers,
          testPosts
        )
      );

      it('responds with 200 and all of the posts', () => {
        const expectedPosts = testPosts.map((post) =>
          helpers.makeExpectedPost(testUsers, post)
        );
        return supertest(app).get('/api/posts').expect(200, expectedPosts);
      });
    });

    context('Given an XSS attack post', () => {
      const { maliciousPost, expectedPost } = helpers.makeMaliciousPost(
        testUser
      );

      beforeEach('insert malicious post', () => {
        return helpers.seedMaliciousPost(db, testUser, maliciousPost);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/posts')
          .expect(200)
          .expect((res) => {
            expect(res.body[0].title).to.eql(expectedPost.title);
            expect(res.body[0].content).to.eql(expectedPost.content);
          });
      });
    });
  });
  //
  describe('GET /api/posts/:post_id', () => {
    context('Given no posts', () => {
      it('responds with 404', () => {
        const postId = 123456;
        return supertest(app)
          .get(`/api/posts/${postId}`)
          .expect(404, { error: 'Post doesn\'t exist' });
      });
    });

    context('Given there are posts in the database', () => {
      beforeEach('insert posts', () =>
        helpers.seedPostsTables(db, testUsers, testPosts)
      );

      it('responds with 200 and the specified post', () => {
        const postId = 2;
        const expectedPost = helpers.makeExpectedPost(
          testUsers,
          testPosts[postId - 1]
        );

        return supertest(app)
          .get(`/api/posts/${postId}`)
          .expect(200, expectedPost);
      });
    });

    context('Given an XSS attack post', () => {
      const { maliciousPost, expectedPost } = helpers.makeMaliciousPost(
        testUser
      );

      beforeEach('insert malicious post', () => {
        return helpers.seedMaliciousPost(db, testUser, maliciousPost);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/posts/${maliciousPost.post_id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(expectedPost.title);
            expect(res.body.content).to.eql(expectedPost.content);
          });
      });
    });
  });

// POST testing ====== ======= ====== ====== =====

describe(`POST /api/posts`, () => {
  beforeEach('insert posts', () =>
    helpers.seedPostsTables(
      db,
      testUsers,
      testPosts,
    )
  )

  it(`creates a post, responding with 201 and the new post`, function() {
    const testPost = testPosts[0]
    const testUser = testUsers[0]
    const newPost = {
      title: 'Test new post title',
      content: 'Test new post content',
      section: 'Jobs',
      post_id: testPost.post_id,
      user_id: testUser.user_id,
    }
    return supertest(app)
      .post('/api/posts')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(newPost)
      .expect(201)
      .expect(res => {
        expect(res.body).to.have.property('user_id')
        expect(res.body.title).to.eql(newPost.title)
        expect(res.body.content).to.eql(newPost.content)
        expect(res.body.section).to.eql(newPost.section)
        expect(res.body.user_id).to.eql(newPost.user_id)
        expect(res.body.user_id).to.eql(testUser.user_id)
        expect(res.headers.location).to.eql(`/api/posts/${res.body.post_id}`)
      })
      .expect(res =>
        db
          .from('posts')
          .select('*')
          .where({ post_id: res.body.post_id })
          .first()
          .then(row => {
            expect(row.title).to.eql(newPost.title)
            expect(row.content).to.eql(newPost.content)
            expect(row.section).to.eql(newPost.section)
            expect(row.user_id).to.eql(newPost.user_id)
          })
      )
  })


    
})

// == ====== ===== ===== ==== ==== =
  
});
