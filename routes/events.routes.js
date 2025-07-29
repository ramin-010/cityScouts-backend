const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {authMiddleware, isAdmin, isContributor, dashboardAccess} = require('../middlewares/auth')


const multiFeilds = upload.fields([
        {name : 'mainImage', maxCount : 1},
        {name : 'images', maxCount : 5}
]);
const {
    getEvents, 
    getEvent, 
    adminGetEvents, 
    adminGetEvent,
    createEvent, 
    updateEvent, 
    hardDeleteEvent, 
    softDeleteEvent} = require('../controllers/event.controller');

//public roles
router.get('/', getEvents);
router.get('/:slug', getEvent);

//admin roles
router.get('/admin/all',authMiddleware, dashboardAccess,    adminGetEvents);
router.get('/admin/:slug',authMiddleware, dashboardAccess,  adminGetEvent);
router.post('/admin/',authMiddleware, isAdmin,              multiFeilds, createEvent);
router.put('/admin/:slug',authMiddleware, isContributor,      multiFeilds, updateEvent);
router.delete('/admin/hard/:id',authMiddleware, isAdmin,    hardDeleteEvent);
router.delete('/admin/soft/:id',authMiddleware, isAdmin,    softDeleteEvent);

module.exports = router;