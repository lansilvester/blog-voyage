const express = require('express')

const Comments = require('../schemas/comment')
const Posts = require('../schemas/post')

const router = express.Router()

router.get('/comments', async (req, res) => {
    const comments = await Comments.find({}, { postId: 1, user: 1, comment: 1 }).sort({ createdAt: -1 })
    const postId = comments.map(comment => comment.postId)
    const posts = await Posts.find({ postId: postId })
    const result = posts.map(post => {
        return {
            postId: post.postId,
            comments: comments.filter(comment => comment.postId === post.postId)
        }
    })
    res.json({
        data: result
    })
})

router.post('/post/:postId/comments', async (req, res) => {
    const { postId } = req.params
    const { user, password, comment } = req.body

    if (!comment) {
        return res.json({ errorMessage: "Please enter the comment content" })
    }

    const createComment = await Comments.create({
        postId,
        user,
        password,
        comment
    })
    return res.json({
        comment: createComment
    })
})

router.put('/post/:postId/comments', async (req, res) => {
    const { _id, password, comment } = req.body
    const data = await Comments.findOne({ _id: _id })
    const passwordcomment = data.password

    if (!comment) {
        return res.json({ errorMessage: "Please enter the comment content" })
    }

    if (password !== passwordcomment) {
        return res.json({ errorMessage: "Auth failed" })
    }

    if (data) {
        await Comments.updateOne({ _id: _id },
            {
                $set: {
                    comment: comment
                }
            })
    }
    return res.json({
        result: 'success',
        success: true,
    })
})

router.delete('/post/:postId/comments', async (req, res) => {
    const { _id, password } = req.body
    const data = await Comments.findOne({ _id: _id })
    const passwordcomment = data.password

    if (password !== passwordcomment) {
        return res.json({ errorMessage: "Auth failed" })
    }

    if (data) {
        await Comments.deleteOne({ _id: _id })
    }
    return res.json({
        result: 'success',
        success: true,
    })
})

module.exports = router