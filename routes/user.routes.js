const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')

const {updateProfile, adminGetUsers, setUserRole,addFavorite,deleteFavorites} = require('../controllers/user.controller')
const {authMiddleware, isAdmin, isContributor, dashboardAccess, DontAllowRecruiterToChangePass} = require('../middlewares/auth')



router.put('/updateProfile/:id', authMiddleware, DontAllowRecruiterToChangePass ,upload.single('image'), updateProfile);

router.get('/admin/all',authMiddleware ,dashboardAccess, adminGetUsers);

router.patch('/admin/userRole/:userId',authMiddleware, isAdmin, setUserRole )

router.post('/favorite/:id', authMiddleware , addFavorite);
router.delete('/favorite/:id', authMiddleware , deleteFavorites);


module.exports = router;