const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const role = require('../middleware/permissions/blog');

const adminController = require('../controllers/admin');
const blogController = require('../controllers/blog');
const userController = require('../controllers/user');

router.get('/', blogController.get_all_blogs);

router.get('/:blogId', blogController.get_a_blog);

router.post('/', auth, role.auth('CREATE'), upload.array('images',5), blogController.create_blog);

router.patch('/:blogId', auth, role.auth('PATCH'), blogController.patch_blog);

router.delete('/:blogId', auth, role.auth('DELETE'), blogController.delete_blog);

module.exports = router;