import AuthPost from '../models/authPost.js';

export const createAuthPost = async (req, res) => {
  try {
    const { title, body, userInt } = req.body;
    
    // If you're storing the image path/URL:
    // req.file will exist if an image was uploaded with Multer.
    // For example, if you used upload.single('image'):
    // const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    // Or if you upload to S3/Cloudinary, you'd have a different approach here:
    let imageUrl = null;
    if (req.file) {
      // For a local path:
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // If you want to tie this post to the authenticated user, 
    // you can use req.user from passport. For example:
    // const authorId = req.user._id; // if using JWT or session

    const newPost = await AuthPost.create({
      title,
      body,
      userInt,
      imageUrl,
      // author: authorId  // optional if your schema has an `author` field
    });

    return res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating post' });
  }
};

export const getAllAuthPosts = async (req, res) => {
  try {
    const posts = await AuthPost.find();
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching posts' });
  }
};

export const getAuthPostById = async (req, res) => {
  try {
    const post = await AuthPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching post' });
  }
};

export const updateAuthPost = async (req, res) => {
  try {
    const { title, body, userInt } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (body) updatedFields.body = body;
    if (userInt) updatedFields.userInt = userInt;
    if (imageUrl) updatedFields.imageUrl = imageUrl;

    const post = await AuthPost.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating post' });
  }
};

export const deleteAuthPost = async (req, res) => {
  try {
    const post = await AuthPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error deleting post' });
  }
};
