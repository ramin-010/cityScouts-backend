const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {authMiddleware, isAdmin, isContributor, dashboardAccess} = require('../middlewares/auth')


const multiFeilds = upload.fields([
        {name : 'mainImage', maxCount : 1},
        {name : 'images', maxCount : 5}
]);

const {
    getDinings, 
    getDining, 
    adminGetDinings,
    adminGetDining,
    createDining,
    updateDining,
    hardDeleteDining, 
    softDeletDining} = require('../controllers/dining.controller');

//public roles
router.get('/',getDinings);
router.get('/:slug', getDining);

//admin roles
router.get('/admin/all',authMiddleware, dashboardAccess,    adminGetDinings);
router.get('/admin/:slug',authMiddleware, dashboardAccess,  adminGetDining)
router.post('/admin/',authMiddleware, isAdmin,              multiFeilds, createDining);
router.put('/admin/:slug',authMiddleware, isContributor,      multiFeilds, updateDining);
router.delete('/admin/soft/:id',authMiddleware, isAdmin,    softDeletDining);
router.delete('/admin/hard/:id',authMiddleware, isAdmin,    hardDeleteDining);

module.exports = router;