const Attraction = require('../models/Attraction');
const ErrorResponse = require('../utils/errorResponse');
const {getOne, adminGetAll,adminGetOne, createOne, updateOne, hardDeleteOne, softDeletOne} = require('../utils/crudFactory')


//@desc : get all/filtered attraction
//@route : /api/attraction/
//access : public

const getAttractions = async(req, res, next)=>{
    try{
        const {
            page, 
            limit = 9, 
            search = '', 
            category, 
            location, 
            rating, 
            price
        } = req.query;
     
        const queryObj = {isDeleted : false}
    
        if(search){
            queryObj.$or = [
                {name : {$regex: search, $options: 'i'}},
                {description : {$regex: search, $options: 'i'}},
                {location: {$regex: search, $options: 'i'}},
                {features: {$regex: search, $options: 'i'}},
                {category : {$regex : search, $options : 'i'}}
            ];
        }
    
        if(category) queryObj.category = category;
        if(location) queryObj.location = {$regex: location, $options: 'i'};
        if(rating) queryObj.rating = {$gte : parseFloat(rating) || 0};
        if(price == 'Free'){
            queryObj.$or = [
                {price : 'Free'}, {price : 'Free Entry'}
            ]
        }
    
        const attractions = await Attraction.find(queryObj)
            .sort({ _id : 1})
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))

        console.log("this is the current page",parseInt(page) * parseInt(limit));

        const total = await Attraction.countDocuments(queryObj);
        
        res.status(200).json({
            success: true,
            page: parseInt(page),
            limit: parseInt(limit),
            data: attractions,
            total: total
        })

    }catch(err){
        next(err);
    }
}

//@desc : get the attraction by id/slug
//@route : /api/attraction/:id
//access : public
const getAttraction = getOne(Attraction);

//@desc get attraction for admin
//route api/admin/getAttraction
//access private
const adminGetAttractions = adminGetAll(Attraction)

//for admin dashboard 
const adminGetAttraction = adminGetOne(Attraction)

//@desc : add attraction
//@route : /api/attraction/
//access : private/admin
const createAttraction = createOne(Attraction);


//@desc : update attraction
//@route : /api/admin/attraction/:id
//access : private/admin
const updateAttraction = updateOne(Attraction)

//@desc : hard delete
//@route : /api/admin/attraction/hardDelete/:id
//access : private/admin/
const hardDeleteAttraction = hardDeleteOne(Attraction);

//@desc : soft delete
//@route : /api/admin/attraction/softDelete/:id
//access : private/admin
const softDeleteAttraction = softDeletOne(Attraction)

module.exports = {getAttractions, adminGetAttraction,adminGetAttractions, getAttraction, createAttraction, updateAttraction, softDeleteAttraction, hardDeleteAttraction}