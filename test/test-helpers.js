const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      email: 'user1@email.com',
      password: 'Password!99',
      date_created: new Date('2019-01-22T16:28:32.615Z'),
    },
    {
      user_id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      email: 'user2@email.com',
      password: 'Password@66',
      date_created: new Date('2019-01-22T16:28:32.615Z'),
    },
    {
      user_id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      email: 'user3@email.com',
      password: 'Password@77',
      date_created: new Date('2019-01-22T16:28:32.615Z'),
    },
    {
      user_id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      email: 'user4@email.com',
      password: 'Password@88',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      user_id: 5,
      user_name: 'test-user-5',
      full_name: 'Test user 5',
      email: 'user5@email.com',
      password: 'Password@99',
      date_created: new Date('2020-01-22T16:28:32.615Z'),
    },
  ]
}

function makePostsArray(users) {
  return [
    {
      post_id: 1,
      title: 'First test post!',
      section: 'Events',
      user_id: users[0].user_id,
      date_created: new Date('2019-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      post_id: 2,
      title: 'Second test post!',
      section: 'Cars',
      user_id: users[1].user_id,
      date_created: new Date('2020-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      post_id: 3,
      title: 'Third test post!',
      section: 'Apartments',
      user_id: users[2].user_id,
      date_created: new Date('2019-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      post_id: 4,
      title: 'Fourth test post!',
      section: 'Other',
      user_id: users[3].user_id,
      date_created: new Date('2019-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      post_id: 5,
      title: 'Fifth test post!',
      section: 'Jobs',
      user_id: users[4].user_id,
      date_created: new Date('2020-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    }
  ]
}


function makeExpectedPost(users, post) { // here
  const author = users
    .find(user => user.user_id === post.user_id)

  return {
    post_id: post.post_id,
    section: post.section,
    title: post.title,
    content: post.content,
    date_created: post.date_created.toISOString(),
    user_id: post.user_id,
  }
}


function makeMaliciousPost(user) {
  const maliciousPost = {
    post_id: 911,
    section: 'Cars',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.user_id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedPost = {
    ...makeExpectedPost([user], maliciousPost),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousPost,
    expectedPost,
  }
}

function makePostsFixtures() {
  const testUsers = makeUsersArray()
  const testPosts = makePostsArray(testUsers)
  return { testUsers, testPosts }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        posts,
        users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE posts_post_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_user_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('posts_post_id_seq', 0)`),
        trx.raw(`SELECT setval('users_user_id_seq', 0)`),
      ])
    )
  )
}

function seedPostsTables(db, users, posts) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await trx.into('users').insert(users)
    await trx.into('posts').insert(posts)
    // update the auto sequence to match the forced id values
    await Promise.all([
      trx.raw(
        `SELECT setval('users_user_id_seq', ?)`,
        [users[users.length - 1].user_id],
      ),
      trx.raw(
        `SELECT setval('posts_post_id_seq', ?)`,
        [posts[posts.length - 1].post_id],
      ),
    ])
    // only insert comments if there are some, also update the sequence counter
   
  })
}

function seedMaliciousPost(db, user, post) {
  return db
    .into('users')
    .insert([user])
    .then(() =>
      db
        .into('posts')
        .insert([post])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('users').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('users_user_id_seq', ?)`,
      [users[users.length - 1].user_id],
    )
  })
}

module.exports = {
  makeAuthHeader,
  seedUsers,
  makeUsersArray,
  makePostsArray,
  makeExpectedPost,
  makeMaliciousPost,
  makePostsFixtures,
  cleanTables,
  seedPostsTables,
  seedMaliciousPost,
}