const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > favorite.likes)
            favorite = blog
    })
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    let authors = new Map()
    blogs.forEach(blog => {
        authors.set(blog.author, !authors.get(blog.author) ? 1 : authors.get(blog.author) + 1)
    })
    let result
    authors.forEach((authorblogs, authorname) => {
        if (!result || authorblogs > result.blogs) {
            result = { author: authorname, blogs: authorblogs }
        }
    })
    return result
}

const mostLikes = (blogs) => {
    let authors = new Map()
    blogs.forEach(blog => {
        authors.set(blog.author, !authors.get(blog.author) ? blog.likes : authors.get(blog.author) + blog.likes)
    })
    let result
    authors.forEach((authorLikes, authorname) => {
        if (!result || authorLikes > result.likes) {
            result = { author: authorname, likes: authorLikes }
        }
    })
    return result
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}