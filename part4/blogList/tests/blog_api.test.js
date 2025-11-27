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

  assert(title.includes("Test blog"));
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  console.log(response);
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});
//4.11
test("if likes is missing add value 0 to it", async () => {
  const newBlog = {
    title: "Blog without likes",
    author: "Alberth",
    url: "https://test",
    //likes missing
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const addedBlog = blogsAtEnd.find((b) => b.title === "Blog without likes");
  assert.strictEqual(addedBlog.likes, 0);
});

//4.12
test("if title is missing respond with 400 Bad Request", async () => {
  const newBlog = {
    //title missing
    author: "Alberth",
    url: "https://test",
    likes: 4,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  //Should not be addeed, checking length
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});
//4.12
test("if url is missing respond with 400 Bad Request", async () => {
  const newBlog = {
    title: "Test blog, url missing",
    author: "Alberth",
    likes: 4,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  //Should not be addeed, checking length
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

//4.13 deleting test
test("deleting a blog with id", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToBeDeleted = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  const contents = blogsAtEnd.map((b) => b.title);
  assert(!contents.includes(blogToBeDeleted.title));

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});
//4.14 updating test
test("updating a blog", async() => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToBeUpdated = blogsAtStart[0];

  const newBlogInfo = {
    title: "Test updating blog",
    author: "updating blog",
    url: "https://test",
    likes: 4,
  };

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(newBlogInfo)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  //Same length
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

  // Find the updated one
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToBeUpdated.id);
  
  //See if it was updated
  assert.strictEqual(updatedBlog.title, newBlogInfo.title);
  assert.strictEqual(updatedBlog.author, newBlogInfo.author);
  assert.strictEqual(updatedBlog.url, newBlogInfo.url);
  assert.strictEqual(updatedBlog.likes, newBlogInfo.likes);
  
})
