const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken")
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");
require("dotenv").config();


blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", userExtractor, async (req, res) => {

  const { title, author, url, likes, userId } = req.body;
  const user = req.user; // Extracted in middleware

  if (!title) {
    return res.status(400).json({ error: "title is missing" });
  }
  if (!url) {
    return res.status(400).json({ error: "url is missing" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

//4.13 Delete blog
blogsRouter.delete("/:id", userExtractor, async (req, res) => {
  const { id } = req.params;
  const user = req.user; // user extracted in middleware

  const blog = await Blog.findById(id)
  if(!blog) {
    return res.status(404).json({error: "blog not found"})
  }

  if(blog.user.toString() !== user._id.toString()){
    return res.status(401).json({error: "A user can only delete its own blogs"})
  }
  
    await Blog.findByIdAndDelete(id);
    res.status(204).end();

});

//4.13 Update blog
blogsRouter.put("/:id", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const { id } = req.params;

  const updateData = {
    title,
    author,
    url,
    likes: likes || 0,
  };

  try {
    const updated = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "blog not found" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: "blog failed to be updated" });
  }
});

module.exports = blogsRouter;
