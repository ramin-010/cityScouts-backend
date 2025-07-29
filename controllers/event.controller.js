const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const {getOne, adminGetAll,adminGetOne, createOne, updateOne, hardDeleteOne, softDeletOne} = require('../utils/crudFactory')


//@desc : get all/filtered event
//@route : /api/event/
//access : public
const getEvents = async(req, res, next) =>{
    console.log("inside get events")
    try{
        const {
          page = 1,
          limit = 9,
          filter,
          search            
        } = req.query

        const queryObj = {isDeleted : false}

        if(search){
            queryObj.$or = [
                {name : {$regex : search, $options : 'i' }},
                {description : {$regex : search, $options : 'i'}},
                {features : {$regex : search, $options : 'i'}},
                {location : {$regex : search, $options : 'i'}},
            ]
        }

        if(filter && filter !== 'all'){
            queryObj.category = filter
        }
        
        const events = await Event.find(queryObj)
            .sort({_id : 1, createdAt : -1})
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))

        const total = await Event.countDocuments(queryObj);

        res.status(200).json({
            success : true,
            data : events,
            limit : limit,
            page: parseInt(page),
            total : total
        })
    }catch(err){
        next(err)
    }
}

//@desc : get the event by id/slug
//@route : /api/event/:id
//access : public
const getEvent = getOne(Event)

//@desc : add event for admin
//@route : /api/admin/event/
//access : private/admin
const adminGetEvents = adminGetAll(Event)

const adminGetEvent = adminGetOne(Event)

//@desc : add event
//@route : /api/admin/event/
//access : private/admin
const createEvent = createOne(Event);

//@desc : update event
//@route : /api/admin/event/:id
//access : private/admin
const updateEvent = updateOne(Event)


//@desc : hard delete
//@route : /api/admin/event/hardDelete/:id
//access : private/admin/
const hardDeleteEvent = hardDeleteOne(Event);

//@desc : soft delete
//@route : /api/admin/event/softDelete/:id
//access : private/admin
const softDeleteEvent = softDeletOne(Event)


module.exports = {getEvents, getEvent, adminGetEvents,adminGetEvent, createEvent, updateEvent, hardDeleteEvent, softDeleteEvent}