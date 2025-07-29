const mongoose = require('mongoose')
const slugify = require('slugify');

const AttractionSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: [true, "Please add a name"],
        trim: true,
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    slug:{
        type: String,
        sparse: true,
        unique: true
    },
    description:{
        type: String,
        required:[true, "Please addd a description"],
        maxlength:[1000, 'Description cannot be more than 100 characters']
    },
    category: {
        type: [String],
        required: [true, "Please add at least one category"],
        validate: {
          validator: function (value) {
            return value.length > 0;
          },
          message: "You must select at least one category"
        },
        enum: {
          values: [
            'Landmarks',
            'Museums',
            'Parks',
            'Entertainment',
            'Religious Sites',
            'Shopping',
            'Tours',
            'Other'
          ],
          message: '{VALUE} is not a valid category'
        }
      },
    location:{
        address:{
            type: String,
            required: [true, "Please add an address"]   
        },
        city:{
            type: String,
            required : [true, "please add a city"]
        },
        state:{
            type: String,
            required: [true, "Please add th state"]  //keeping it not sepcific as maybe it can be scaled to more cities
        },
        country:{
            type: String,
            default : 'India'            
        },
        coordinates:{
            type:{
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates:{
                type:[Number],
                required: true,
            }
        },
    },
    images:[
        {
            url:{
                type: String,
                required: [true, "Please add an image"]
            },
            altTest:{
                type: String,
                default: 'Atrraction Image'
            },
            publicId : {
                type : String,
                required : [true , "Missing cloud Sub-Imagepublic id"]
            }
        }
    ],
    mainImage:{
        type: String,
        required: [true, "Please add main image url"]
    },
    mainImagePublicId :{
        type : String ,
        required : [true , "Missing cloud Main-Imagepublic id"]
    },
    openingHours:{
        monday:{type: String, default: "Closed"},
        tuesday:{type: String, default: "Closed"},
        wednesday:{type: String, default: "Closed"},
        thursday:{type: String, default: "Closed"},
        friday:{type: String, default: "Closed"},
        saturday:{type: String, default: "Closed"},
        sunday:{type: String, default: "Closed"},
    },
    ticketPrice:{
        adult:{
            type: Number,
            default: 0
        },
        child:{
            type: Number,
            default: 0,
        },
        student:{
            type: Number,
            default:0,
        },
        senior:{
            type: Number,
            default: 0,
        }
    },
    rating:{
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 4
    },
    features:{
        type: [String],
        default: []
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    reviews:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
    }],
    isDeleted:{
        type : Boolean,
        default: false
    },
  
},{
    timestamps:{
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    }
});

AttractionSchema.pre('save', function(next) {
    if (!this.slug) {
      const baseSlug = slugify(this.name, {
        lower: true,
        strict: true, 
        trim: true,
      });
  
      this.slug = `A-${baseSlug}`;
    }
    next();
  });

//left
AttractionSchema.index({ 'location.coordinates': '2dsphere' });


module.exports = mongoose.model('Attraction', AttractionSchema);