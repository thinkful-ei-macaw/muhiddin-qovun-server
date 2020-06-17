# Qovun

The app will eventually help connect Uzbek-Americans, people interested in Uzbek tradition and/or communities
and help organize events and meetups, although the app is at the beginning stage right now.

[Live](https://www.qovun.com/)

[Client](https://github.com/thinkful-ei-macaw/muhiddin-qovun-client)

[Server](https://github.com/thinkful-ei-macaw/muhiddin-qovun-server)

## Installing

Qovun requires Node.js v12.14+ and npm 6.14+ to run.
Install the dependencies and devDependencies and start the server.

```
npm install
```

## Running the tests

To run tests, simply run `npm test` in the terminal.

## API Overview

#### POST /api/auth/login

```js
// req.body
{
  username: String,
  password: String
}

// res.body
{
  authToken: String
}

```

#### POST /api/users

```js
// req.body
{
  user_name: String,
  password: String,
  full_name: String,
  email: String
}

// res.body
{
  user_id: Number,
  full_name: String,
  user_name: String,
  email: String,
  date_created: String,
}

```

#### GET /api/users/user

```js
// req.body
{
  full_name: String,
  user_name: String
}

```

#### GET /api/post

```js
// res.body

[
  {
    post_id: Number,
    section: String,
    user_name: String,
    title: String,
    content: String,
    date_created: String,
  },
];
```

#### GET /api/user-posts

```js
// res.body
[
  {
    post_id: Number,
    title: String,
    content: String,
    date_created: String,
    user_name: String,
    section: String,
  },
];
```

#### POST /api/posts

```js
//

// res.post
{
  title: String,
  content: String,
  section: String
}

// res.body

{
  post_id: Number,
  section: String,
  user_name: String,
  title: String,
  content: String,
  date_created: String
}
```

#### GET /api/posts/:post_id

```js

// res.body

{
  post_id: Number,
  section: String,
  user_name: String,
  title: String,
  content: String,
  date_created: String
}
```

#### DELETE /api/posts/:post_id

```js
// res.body

{
  status: 204;
}
```

#### PATCH /api/posts/:post_id

```js

// req.body
{
  title: String,
  content: String,
  section: String
}
// res.body

{
  post_id: Number,
  title: String,
  content: String,
  date_created: String,
  user_name: String,
  section: String
}
```

## Tech Stack

- [Node](https://nodejs.org/en/) - Asynchronous event-driven JavaScript runtime
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database
- [Knex](http://knexjs.org/) - SQL query builder
- [JWT](https://jwt.io/) - Authentication
- [Mocha](https://mochajs.org/) - A feature-rich JavaScript test framework
- [Chai](https://www.chaijs.com/) - BDD/TDD assertion library for node and the browser

## Author

- [Muhiddin](https://github.com/muhiddinsgithub)
