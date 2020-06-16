const PostsService = {
  getAllPostTypes(knex) {
    return knex.select("section").from("posts").distinct();
  },
  getAllPosts(knex) {
    return knex.select("*").from("posts");
  },
  getPostsForUser(db, user_id) {
    return db
      .from("posts")
      .select("*")
      .where("user_id", user_id)
      .orderBy("date_created", "desc");
  },
  insertPost(knex, newPost) {
    return knex
      .insert(newPost)
      .into("posts")
      .returning("*")
      .then(([post]) => post)
      .then((post) => PostsService.getById(knex, post.post_id));
  },
  getById(knex, id) {
    return knex.from("posts").select("*").where("post_id", id).first();
  },
  deletePost(knex, id) {
    return knex("posts").where({ post_id: id }).delete();
  },
  updatePost(knex, id, newPostFields) {
    return knex("posts")
      .where({ post_id: id })
      .update(newPostFields)
      .returning("*");
  },
  validatePost(title, description) {
    if (title.trim() < 2 || description.trim() < 2)
      return "must have at least 2 characters!";
  },
};

module.exports = PostsService;
