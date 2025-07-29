const { updateSearchIndex } = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const {uploadToCloud, deleteFromCloud} = require('./uploadImage')

// @desc get a single 
// @access public

const getOne = (Model, populateOption) => async(req, res, next) =>{
    try{
        const doc = await Model.findOne({
            slug: req.params.slug,
            isDeleted : false
        });

        if(populateOption) doc.populate(populateOption);

        if(!doc){
            throw new ErrorResponse(404, `${Model.modelName} not found`);
        }

        res.status(200).json({
            success : true,
            data : doc,
        })

    }catch(err){    
        next(err);
    }
}

// @desc get 
// @access private

const adminGetAll = (Model) => async(req, res, next) =>{
    try{
        const docs = await Model.find();

        if(!docs){
            throw new ErrorResponse(404, `${Model.modelName} not found`);
        }

        res.status(200).json({
            success : true,
            data : docs
        })
    }catch(err){
        next(err);
    }
}

// @desc get a single 
// @access public

const adminGetOne = (Model) => async(req, res, next) =>{
    try{
        const doc = await Model.findOne({
            slug: req.params.slug,
        });

        if(!doc){
            throw new ErrorResponse(404, `${Model.modelName} not found`);
        }

        res.status(200).json({
            success : true,
            data : doc,
        })

    }catch(err){    
        next(err);
    }
}




// @desc create 
// @access private

const createOne = (Model) => async(req, res, next) =>{
    try{
        const exist = await Model.findOne({name : req.body.name});
        if(exist){
            throw new ErrorResponse(400, "Attraction already exist");
        }
        
        const mainImage = req.files?.['mainImage']?.[0];
        const subImages = req.files?.['images'] || [];
        
        if(!mainImage){
            throw new ErrorResponse(400, 'Please provide the main image');
        }
        console.log("this is the querycoming ", req.body)
        // Debug log for files
        console.log('Uploaded files:', {
            mainImage: mainImage?.filename,
            subImages: subImages.map(img => img?.filename)
        });

        if(!req.body.name){
            throw new ErrorResponse(400, 'Please provide the name')
        }
        const {url : mainImageUrl, publicId : mainImagePublicId} = await uploadToCloud(mainImage.buffer, "attractions/main");
        let subImageUploads = [];
       
        if(subImages.length > 0) {
            subImageUploads = await Promise.all(
                subImages.map((e) => {
                    if (e && e.buffer) {
                        return uploadToCloud(e.buffer, "attractions/sub");
                    }
                    return null;
                })
            );
            console.log('Sub-images upload results:', subImageUploads);
        }
        const subImageArray = subImageUploads.map((e) => ({
            url : e.url,
            publicId : e.publicId
        }));
       
        function safeParse(jsonString) {
            try {
              return JSON.parse(jsonString);
            } catch (err) {
              return null;
            }
          }
          
        const location = safeParse(req.body.location);
        const coords = location?.coordinates?.coordinates?.map(Number) || [];
        const openingHours = safeParse(req.body.openingHours);
        const features = safeParse(req.body.features);
        const date = safeParse(req.body.date);
        const time = safeParse(req.body.time);
        const organizer = safeParse(req.body.organizer);
        const famousDishes = safeParse(req.body.famousDishes);
        const ticketPrice = safeParse(req.body.ticketPrice);
        const reviews = safeParse(req.body.reviews);
        const priceRange = safeParse(req.body.priceRange);
        const cuisine = safeParse(req.body.cuisine);
        const rating = safeParse(req.body.rating);

        console.log("addddddddddddddddddddd", organizer)
        // const organizerContact = typeof organizer.contact === 'string'
        //     ? JSON.parse(organizer.contact)
        //     : organizer.contact;
      
        
        const queryObj = {
            name: req.body.name,  //done
            description: req.body.description,  //done
            category: req.body.category,  //done
            isFeatured: req.body.isFeatured === 'true',  //done
            isDeleted: req.body.isDeleted === 'true',  //done
            location: {                 //done
                address: location.address,
                city: location.city,
                state: location.state,
                country: location.country || 'India',
                coordinates: {
                    type: 'Point',
                    coordinates: coords
                }
            },           
            mainImage: mainImageUrl,  //done
            images: subImageArray,  //done
            mainImagePublicId: mainImagePublicId  //done
        }

        if((Model.modelName === 'Dining' || Model.modelName === 'Event') && Object.values(features).some(e => e === true) ){
            queryObj.features = features;
        }else if(Model.modelName === 'Attraction' && features.length !== 0 ) queryObj.features = features;

        if(Model.modelName === 'Attraction'){
            queryObj.ticketPrice =  {
                adult: Number(ticketPrice.adult) || 0,
                child: Number(ticketPrice.child) || 0,
                student: Number(ticketPrice.student) || 0,
                senior: Number(ticketPrice.senior) || 0
            } 
        }
    
        if(Model.modelName === 'Event'){
            queryObj.organizer = organizer
            queryObj.date = date
            queryObj.time = time
        } 
        if(Model.modelName === 'Dining'){
            queryObj.cuisine = cuisine;
            queryObj.famousDishes = famousDishes;
            queryObj.priceRange = priceRange;
        }
        if(Model.modelName === 'Attraction' || Model.modelName === 'Dining'){
            queryObj.openingHours = openingHours
            queryObj.rating = rating;
            queryObj.reviews = reviews;
        }

        console.log("this is the final query",queryObj)
        const doc = await Model.create(queryObj);
        
        res.status(200).json({
            success : true,
            data : doc
        })
    }catch(err){
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(e => e.message);

            res.status(404).json({
                success : false,
                message : message,
            })
        }else{
            next(err);
        }
    }
}

// @desc update 
// @access private

const updateOne = (Model) => async (req, res, next) => {
    try {
        console.log("this is the slug", req);
        const existingDoc = await Model.findOne({ slug: req.params.slug });
        if (!existingDoc) {
            throw new ErrorResponse(
                404,
                `${Model.modelName} with slug ${req.params.slug} does not exist`
            );
        }

        console.log("this is the query coming ", req.body);

        // Handle deletion of main image
        const isMainImageToDelete = req.body.publicIdMain || "";  // public id will always come as string
        if (isMainImageToDelete) {
            console.log("deleting the main image with the id", isMainImageToDelete);
            await deleteFromCloud(isMainImageToDelete);  // sending the public id of mainImage to delete from cloud
            existingDoc.mainImage = "no Image rightnow";
            existingDoc.mainImagePublicId = "no Image rightnow";
            await existingDoc.save();
        }
        console.log("this is the subImages ", req.body.publicIdSub)
        // Handle deletion of sub images
        const isSubImageToDelete = safeParse(req.body.publicIdSub) || [];  // public id will always come in [publicId]
        if (isSubImageToDelete.length > 0) {
            await Promise.all(
                isSubImageToDelete.map((e) => deleteFromCloud(e))
            );  // sending the public ids of Sub images to delete from the cloud
        }

        const updatedSubImagesArray = existingDoc.images.filter(
            (e) => !isSubImageToDelete.includes(e.publicId)
        );

        function safeParse(jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (err) {
                return null;
            }
        }

        const location = safeParse(req.body.location);
        const coords = location?.coordinates?.coordinates?.map(Number) || [];
        const openingHours = safeParse(req.body.openingHours);
        const features = safeParse(req.body.features);
        const date = safeParse(req.body.date);
        const time = safeParse(req.body.time);
        const organizer = safeParse(req.body.organizer);
        const famousDishes = safeParse(req.body.famousDishes);
        const ticketPrice = safeParse(req.body.ticketPrice);

        console.log("dhfssdaa", ticketPrice);

        // query object for update
        const queryObj = {}  // name, description, category, featured, isDeleted trueness handled in the frontend

        // Basic string fields
        if (req.body.name)        queryObj.name = req.body.name;
        if (req.body.category)    queryObj.category = req.body.category;
        if (req.body.description) queryObj.description = req.body.description;
        if (req.body.isFeatured)  queryObj.isFeatured = req.body.isFeatured;
        if (req.body.isDeleted)   queryObj.isDeleted = req.body.isDeleted;

        console.log("ok 1");

        // Model-specific feature fields
        if ((Model.modelName === 'Dining' || Model.modelName === 'Event') &&
            Object.values(features).some((e) => e === true)
        ) {
            queryObj.features = features;
        } else if (Model.modelName === 'Attraction' && features.length !== 0) {
            queryObj.features = features;
        }

        if ((Model.modelName === 'Dining' || Model.modelName === 'Attraction') &&
            Object.values(openingHours).length !== 0
        ) {
            queryObj.openingHours = openingHours;
            if (req.body.rating !== '0') queryObj.rating = req.body.rating;
        }

        if (Model.modelName === 'Attraction') {
            if (ticketPrice.adult)   queryObj.ticketPrice.adult = ticketPrice.adult;
            if (ticketPrice.child)   queryObj.ticketPrice.child = ticketPrice.child;
            if (ticketPrice.student) queryObj.ticketPrice.student = ticketPrice.student;
            if (ticketPrice.senior)  queryObj.ticketPrice.senior = ticketPrice.senior;
        }
        if (Model.modelName === 'Event') {
            if (Object.values(date).every((e) => e !== ""))       queryObj.date = date;
            if (Object.values(time).every((e) => e !== ""))       queryObj.time = time;
            if (organizer.name)                                   queryObj.organizer.name = organizer.name;
            if (organizer.contact.email)                         queryObj.organizer.contact.email = organizer.contact.email;
            if (organizer.contact.phone)                         queryObj.organizer.contact.phone = organizer.contact.phone;
            if (organizer.contact.website)                       queryObj.organizer.contact.website = organizer.contact.website;
        }
        if (Model.modelName === 'Dining') {
            if (req.body.cuisine)          queryObj.cuisine = req.body.cuisine;
            if (famousDishes.length > 0)   queryObj.famousDishes = famousDishes;
            if (req.body.priceRange)       queryObj.priceRange = req.body.priceRange;
        }

        if (location.address)                         queryObj.location.address = location.address;
        if (location.city)                            queryObj.location.city = location.city;
        if (location.state)                           queryObj.location.state = location.state;
        if (coords[0] !== 0 && coords[1] !== 0)       queryObj.location.coordinates.coordinates = coords;

        let newSubImageArray = [];

        console.log("start mainImage upload");
        const mainImage = req.files?.['mainImage']?.[0];
        if (mainImage) {
            const { url: mainImageUrl, publicId: mainImagePublicId } =
                await uploadToCloud(mainImage.buffer, "attractions/main");
            queryObj.mainImage = mainImageUrl;
            queryObj.mainImagePublicId = mainImagePublicId;
        }
        console.log("end main image upload");

        const subImages = req.files?.['images'] || [];
        if (subImages.length > 0) {
            const subImageUploads = await Promise.all(
                subImages.map((e) => uploadToCloud(e.buffer, "attractions/sub"))
            );
            newSubImageArray = subImageUploads.map((e) => ({ url: e.url, publicId: e.publicId }));
        }

        if (updatedSubImagesArray.length > 0 && newSubImageArray.length > 0) {
            queryObj.images = [
                ...updatedSubImagesArray,
                ...newSubImageArray
            ];  // keeping it outside so that only image deleting can happen without adding new images
        }else if (isSubImageToDelete.length > 0 && newSubImageArray.length === 0) {
            queryObj.images = updatedSubImagesArray;
        }

        console.log("this the final query", queryObj);

        // Perform update
        const doc = await Model.findOneAndUpdate(
            { slug: req.params.slug },
            queryObj,
            { new: true, runValidators: true }
        );

        if (!doc) {
            throw new ErrorResponse(404, `${Model.modelName} not found`);
        }

        res.status(200).json({ success: true, data: doc });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((e) => e.message);
            res.status(404).json({ success: false, message });
        } else {
            next(err);
        }
    }
};




// @desc hard delete 
// @access private

const hardDeleteOne = (Model) => async(req, res, next) =>{
    try{
        const doc = await Model.findById(req.params.id);

        if(!doc){
            throw new ErrorResponse(404, `${Model.modelName} not found`);
        }
        const status = await Model.deleteOne({_id : req.params.id});

        if(status.deletedCount === 0){
            throw new ErrorResponse(404, 'Deletion Failed')
        }

        res.status(200).json({
            success : true,
            data : {},
            status : status
        })
    }catch(err){
        next(err)
    }
}


// @desc soft delete 
// @access private


const softDeletOne = (Model) => async(req, res, next) =>{
    try{
        const doc = await Model.findById(req.params.id);

        if(!doc){
            throw new ErrorResponse(404, `${Model.modelName} not found`);
        }

        doc.isDeleted = true;
        await doc.save();

        res.status(200).json({
            success : true,
            data : {}
        })
    }catch(err){
        next(err);
    }   
}

module.exports = {getOne, adminGetAll,adminGetOne, createOne, updateOne, hardDeleteOne, softDeletOne}