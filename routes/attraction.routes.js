const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {authMiddleware, isAdmin, isContributor, dashboardAccess} = require('../middlewares/auth')

const multiFeilds = upload.fields([
        {name : 'mainImage', maxCount : 1},
        {name : 'images', maxCount : 5}
]);

const {
        getAttractions,
        adminGetAttractions,
        adminGetAttraction,
        getAttraction, 
        createAttraction, 
        updateAttraction, 
        softDeleteAttraction, 
        hardDeleteAttraction} = require('../controllers/attraction.controller');

//public roles
router.get('/',getAttractions);
router.get('/:slug', getAttraction);

//admin roles
router.get('/admin/all',authMiddleware, dashboardAccess,    adminGetAttractions);
router.get('/admin/:slug',authMiddleware,dashboardAccess,   adminGetAttraction);
router.post('/admin/',authMiddleware, isAdmin,              multiFeilds, createAttraction);  //here we are uploading the images
router.put('/admin/:slug', authMiddleware, isContributor, multiFeilds, updateAttraction); //here we are uploading the images
router.delete('/admin/soft/:id',authMiddleware, isAdmin,    softDeleteAttraction);
router.delete('/admin/hard/:id',authMiddleware, isAdmin,    hardDeleteAttraction);

module.exports = router;