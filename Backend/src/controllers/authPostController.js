// controllers/authpostController.js

import AuthPost from '../models/authPost.js';

/**
 * Create a new AuthPost
 */
export const createAuthPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    
    // Retrieve userInt from the authenticated user's token (Passport JWT or similar)
    // Make sure Passport is correctly setting req.user
    const userInt = req.user.userInt;

    // If a file is uploaded, build the imageUrl (assuming local uploads)
    let imageUrl = null;
    if (req.file) {
      // If serving uploads statically from the "/uploads" directory:
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create and save the new post
    const newPost = new AuthPost({
      title,
      body,
      userInt,
      imageUrl,
    });
    await newPost.save();

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (err) {
    console.error(err);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating post',
    });
  }
};

/**
 * Get all AuthPosts with optional pagination
 */
export const getAllAuthPosts = async (req, res) => {
  try {
    // Optional pagination parameters: page & limit
    // Example usage: /authposts?page=2&limit=5
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts sorted by creation date, newest first
    const posts = await AuthPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching posts',
    });
  }
};

/**
 * Get a single AuthPost by ID
 */
export const getAuthPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await AuthPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post fetched successfully',
      data: post,
    });
  } catch (err) {
    console.error(err);

    // Handle invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error fetching post',
    });
  }
};

/**
 * Update an existing AuthPost (ownership check included)
 */
export const updateAuthPost = async (req, res) => {
  try {
    const { title, body } = req.body;

    // The authenticated user's ID (integer or however you're storing it)
    const userInt = req.user.userInt;

    // If a file is uploaded, build the new imageUrl
    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Find the existing post
    const post = await AuthPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the authenticated user is the owner
    if (post.userInt !== userInt) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    // Update the post fields
    if (title) post.title = title;
    if (body) post.body = body;
    if (imageUrl) post.imageUrl = imageUrl;

    await post.save();

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating post',
    });
  }
};

/**
 * Delete an existing AuthPost (ownership check included)
 */
export const deleteAuthPost = async (req, res) => {
  try {
    const userInt = req.user.userInt;

    // First, find the post (so we can check ownership)
    const post = await AuthPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the authenticated user is the owner
    if (post.userInt !== userInt) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete the post
    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error deleting post',
    });
  }
};
