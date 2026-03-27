const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const AnalyticsLog = require('../models/AnalyticsLog');
const { verifyToken, isAdmin } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

// @desc    Get all content (Students can view authorized content, so this is available for all authenticated users)
// @route   GET /api/content
router.get('/', verifyToken, async (req, res) => {
  try {
    const content = await Content.find({}).populate('category', 'name').sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single content and log view
// @route   GET /api/content/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('category', 'name');
    if (content) {
      // Log analytics
      await AnalyticsLog.create({
        user: req.user._id,
        action: 'ViewContent',
        contentId: content._id
      });
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

const multer = require('multer');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin Routes below
// @desc    Create new content record (Handles File Upload)
// @route   POST /api/content
router.post('/', verifyToken, isAdmin, upload.single('file'), async (req, res) => {
  const { title, description, type, category, tags } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Determine resource type based on selected type
    const resource_type = type === 'Video' ? 'video' : 'image';
    
    // Upload to Cloudinary via stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type, folder: 'secure-art-platform' },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
        
        try {
          const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
          const content = await Content.create({
            title,
            description,
            type,
            url: result.secure_url,
            public_id: result.public_id,
            category: category === 'null' ? null : category,
            tags: parsedTags
          });
          res.status(201).json(content);
        } catch (dbError) {
          res.status(500).json({ message: 'Database save failed' });
        }
      }
    );

    // End stream with buffer
    uploadStream.end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete content
// @route   DELETE /api/content/:id
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (content) {
      // Delete from Cloudinary if public_id exists
      if (content.public_id) {
        if (content.type === 'Video') {
          await cloudinary.uploader.destroy(content.public_id, { resource_type: 'video' });
        } else {
          await cloudinary.uploader.destroy(content.public_id);
        }
      }

      await Content.deleteOne({ _id: content._id });
      res.json({ message: 'Content removed' });
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

module.exports = router;
