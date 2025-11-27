const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is missing" });
  } else if (!url) {
    return res.status(400).json({ error: "url is missing" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

//4.13 Delete blog
blogsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "no id of blog to be deleted in params" });
  }

  try {
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: "Blog failed to be deleted" });
  }
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
