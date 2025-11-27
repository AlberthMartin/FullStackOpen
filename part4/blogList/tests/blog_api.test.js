const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("Dummy returns 1", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("each blog as id", async () => {
  const response = await api.get("/api/blogs");
  blogs = response.body;

  assert.ok(blogs[0].id);
});

test("a blog can be added", async () => {
  const newBlog = {
    title: "Test blog",
    author: "Me",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 1230,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const title = blogsAtEnd.map((n) => n.title);

  assert(title.includes("Test blog"))
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  console.log(response);
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});
