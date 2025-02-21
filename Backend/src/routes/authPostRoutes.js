import { Router } from 'express';
import multer from 'multer';
import {
  createAuthPost,
  getAllAuthPosts,
  getAuthPostById,
  updateAuthPost,
  deleteAuthPost
} from '../controllers/authpostController.js';

// If you want to ensure users are logged in before creating/updating/deleting posts,
// you can use passport or a custom middleware. For example:
import passport from 'passport';

const router = Router();

// Set up Multer for file uploads if you need to handle images
const upload = multer({ dest: 'uploads/' }); 
// or configure more advanced storage if you use S3, Cloudinary, etc.

// ==========================
//       POST ROUTES
// ==========================

// Create a new AuthPost
// We'll use Multer to handle 'image' file uploads (if any)
// We'll also protect the route with passport's 'jwt' or 'local' strategy if you prefer
router.post(
  '/authposts',
  passport.authenticate('jwt', { session: false }), // Or whichever auth strategy
  upload.single('image'), // If you expect an image field named 'image'
  createAuthPost
);

// Get all posts (Public or protected, up to you)
router.get('/authposts', getAllAuthPosts);

// Get a single post by ID
router.get('/authposts/:id', getAuthPostById);

// Update a post
router.put(
  '/authposts/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'), // If you allow updating the image
  updateAuthPost
);

// Delete a post
router.delete(
  '/authposts/:id',
  passport.authenticate('jwt', { session: false }),
  deleteAuthPost
);

export default router;