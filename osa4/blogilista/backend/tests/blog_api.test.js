const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs have a property called id', async () => {
    const response = await api.get('/api/blogs')
    const hasId = response.body.map(e => e.hasOwnProperty('id'))
    assert(hasId.every(value => value === true))
})

test('there are the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('There is a blog about react', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(e => e.title)
    assert(titles.includes('React patterns'))
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'test title',
        author: 'author',
        url: 'url',
        likes: 0,
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('test title'))
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'author',
        url: 'url',
        likes: 0,
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
        author: 'author',
        title: 'title',
        likes: 0,
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without likes gets 0 likes ', async () => {
    const newBlog = {
        title: 'test title',
        author: 'author',
        url: 'url',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert.strictEqual(response.body.find(blog => blog.title === 'test title').likes, 0)
})

test('a valid blog can be deleted ', async () => {
    const blogsInStart = await helper.blogsInDb();
    const blogToDelete = blogsInStart[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    const blogsInEnd = await helper.blogsInDb();
    const titles = blogsInEnd.map(r => r.title)
    assert.strictEqual(blogsInEnd.length, helper.initialBlogs.length - 1)
    assert(!titles.includes(blogToDelete.title))
})

test('delete fails with status 404 if blog is not found', async () => {
    await api
        .delete(`/api/blogs/${await helper.nonExistingId()}`)
        .expect(404)
    const blogsInEnd = await helper.blogsInDb();
    assert.strictEqual(blogsInEnd.length, helper.initialBlogs.length)
})

test('delete fails with status 400 if id is not valid', async () => {
    await api
        .delete(`/api/blogs/${"0"}`)
        .expect(400)
    const blogsInEnd = await helper.blogsInDb();
    assert.strictEqual(blogsInEnd.length, helper.initialBlogs.length)
})

test('a valid blog can be updated ', async () => {
    const blogsInStart = await helper.blogsInDb();
    const blogToUpdate = blogsInStart[0]
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, title: 'new title', likes: 99 })
        .expect(200)
    const blogsInEnd = await helper.blogsInDb();
    const updatedBlog = blogsInEnd.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(blogsInEnd.length, helper.initialBlogs.length)
    assert(updatedBlog.title === 'new title')
    assert(updatedBlog.likes === 99)
})

test('update fails with status 404 if blog is not found', async () => {
    const blogsInStart = await helper.blogsInDb();
    const blogToUpdate = blogsInStart[0]
    await api
        .put(`/api/blogs/${await helper.nonExistingId()}`)
        .send({ ...blogToUpdate, title: 'new title', likes: 99 })
        .expect(404)
    const blogsInEnd = await helper.blogsInDb();
    assert.strictEqual(blogsInEnd.length, helper.initialBlogs.length)
})

test('update fails with status 400 if id is not valid', async () => {
    const blogsInStart = await helper.blogsInDb();
    const blogToUpdate = blogsInStart[0]
    await api
        .put(`/api/blogs/${'abc'}`)
        .send({ ...blogToUpdate, title: 'new title', likes: 99 })
        .expect(400)
    const blogsInEnd = await helper.blogsInDb();
    assert.strictEqual(blogsInEnd.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})