const path = require("path");
const express = require("express");
const xss = require("xss");
const PostsService = require("./posts-service");
const { requireAuth } = require("../middleware/jwt-auth");

const postsRouter = express.Router();
const postRouter = express.Router();
const jsonParser = express.json();

postsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    PostsService.getAllPosts(knexInstance)
      .then((posts) => {
        res.json(posts.map(serializePost));
      })
      .catch(next);
  })
  .post(jsonParser, requireAuth, (req, res, next) => {
    const { title, content, section } = req.body;
    const { user_name } = req.user;
    const newPost = { user_name, title, content, section };

    // validate post title and description

    const postError = PostsService.validatePost(title, content);
    if (postError) {
      return res
        .status(400)
        .json({ error: `Title and description ${postError}` });
    }

    for (const [key, value] of Object.entries(newPost))
      if (value === null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    PostsService.insertPost(req.app.get("db"), newPost)
      .then((post) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.post_id}`))
          .json(serializePost(post));
      })
      .catch(next);
  });

postRouter
  .route("/user-posts")
  .all(requireAuth, (req, res, next) => {
    const { user_name } = req.user;
    PostsService.getPostsForUser(req.app.get("db"), user_name)
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            error: { message: `Posts don't exist` },
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
  .route("/:post_id")
  .all((req, res, next) => {
    PostsService.getById(req.app.get("db"), req.params.post_id)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            // eslint-disable-next-line quotes
            error: `Post doesn't exist`,
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
    PostsService.deletePost(req.app.get("db"), req.params.post_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { title, content, section } = req.body;
    const { user_name } = req.user;
    const postToUpdate = { title, content, section, user_name };

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Post must contain title and description`,
        },
      });
    // validate post title and description

    const postError = PostsService.validatePost(title, content);
    if (postError) {
      return res
        .status(400)
        .json({ error: `Title and description ${postError}` });
    }

    PostsService.updatePost(req.app.get("db"), req.params.post_id, postToUpdate)
      .then((post) => {
        res.json(post[0]);
      })
      .catch(next);
  });

const serializePost = (post) => ({
  post_id: post.post_id,
  section: post.section,
  user_name: post.user_name,
  title: xss(post.title),
  content: xss(post.content),
  date_created: post.date_created,
});

module.exports = { postsRouter, postRouter };
