const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

const userController = require('../controllers/user');

router.get('/', userController.get_all_users);

router.get('/:userId', userController.get_a_user);

router.post('/signup', upload.single('avatar'), userController.signup_user);

router.post('/login', userController.login_user);

router.patch('/:userId', auth, userController.patch_user);

router.delete('/:userId', auth, userController.delete_user);


module.exports = router;