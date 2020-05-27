const path = require('path');
const express = require('express');
const xss = require('xss');
const PostsService = require('./posts-service');
const { requireAuth } = require('../middleware/jwt-auth');


const postsRouter = express.Router();
const postRouter = express.Router();
const jsonParser = express.json();

postsRouter
  .route('/')
  .get((req, res, next) => {           
    const knexInstance = req.app.get('db');
    PostsService.getAllPosts(knexInstance)
      .then(posts => {
        res.json(posts.map(serializePost));
      })
      .catch(next);
  })
  .post(jsonParser, requireAuth, (req, res, next) => { 
    const { title, content, section } = req.body;
    const { user_id } = req.user;
    const newPost = { user_id, title, content, section };

    for (const [key, value] of Object.entries(newPost))
      if (value === null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    PostsService.insertPost(
      req.app.get('db'),
      newPost
    )
      .then(post => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.post_id}`))
          .json(serializePost(post));
      })
      .catch(next);
  });

postRouter
  .route('/user-posts') 
  .all(requireAuth, (req, res, next) => {
    const { user_id } = req.user;
    PostsService.getPostsForUser(
      req.app.get('db'),
      user_id
    )
      .then(posts => {
        if (!posts) {
          return res.status(404).json({
            // eslint-disable-next-line quotes
            error: { message: `Posts don't exist` }
          });
        }
        res.posts = posts;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.posts);
  });
 

postsRouter
  .route('/:post_id')
  .all((req, res, next) => {
    PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )
      .then(post => {
        if (!post) {
          return res.status(404).json({
            // eslint-disable-next-line quotes
            error: `Post doesn't exist`
          });
        }
        res.post = post;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializePost(res.post));
  })
  .delete(requireAuth, (req, res, next) => {
    PostsService.deletePost(
      req.app.get('db'),
      req.params.post_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { title, content, section} = req.body; 
    const { user_id } = req.user; 
    const postToUpdate = { title, content, section, user_id};

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          // eslint-disable-next-line quotes
          message: `Request body must content either 'title', 'userId' or 'content'`
        }
      });

    PostsService.updatePost(
      req.app.get('db'),
      req.params.post_id,
      postToUpdate
    )
      .then((post) => {
        res.json(post[0]);
      })
      .catch(next);
  });

const serializePost = post => ({
  post_id: post.post_id,
  section: post.section,
  user_id: post.user_id,
  title: xss(post.title),
  content: xss(post.content),
  date_created: post.date_created,
});

module.exports = { postsRouter, postRouter };


