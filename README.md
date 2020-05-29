# Qovun Server

The app will eventually help connect Uzbek-Americans, people interested in Uzbek tradition and/or communities
and help organize events and meetups, although the app is at the beginning stage right now.

Live: https://www.qovun.com/

## Technologies

HTML, CSS, React, NodeJS, Express, PostgreSQL

### Endpoints

#### POST /api/auth/login

// req.body
{
username: String,
password: String
}

// res.body
{
authToken: String,
user_id: ID
}

#### POST /api/users

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
user_name: String,
full_name: String,
password: String,
email: String,
date_created: Date,
}

#### GET /api/user/name

// req.user
{
full_name: String
}

#### /api/user-posts

// res.posts
[
{
post_id: Number,
title: String,
content: String,
date_created: Date,
user_id: Number,
section: String
} ...
]

#### POST, PATCH /api/posts/:post_id

//res.post
{
title: String,
content: String,
section: String
}
