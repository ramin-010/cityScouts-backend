const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug:{
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Festival',
      'Entertainment',
      'Exhibition',
      'Education',
      'Sports',
      'others'
    ]
    
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String
    },
    country: {
      type: String,
      default : "India"
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  date: {
    start: {
      type: Date,
      required: [true, 'Please add a start date']
    },
    end: {
      type: Date,
      required: [true, 'Please add an end date']
    }
  },
  time: {
    start: {
      type: String,
      default : '9:00 AM'
    },
    end: {
      type: String,
      default : '7:00 PM'
    }
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      altText: {
        type: String,
        default: 'Event image'
      },
      publicId : {
        type : String,
        required : [true , "Missing cloud Sub-Imagepublic id"]
    }
    }
  ],
  mainImage: {
    type: String,
    required: [true, 'Please add a main image URL']
  },
  mainImagePublicId :{
    type : String ,
    required : [true , "Missing cloud Main-Imagepublic id"]
},
  ticketPrice: {
    type: Number,
    default: 0
  },
  organizer: {
    name: {
      type: String,
      required: [true, 'Please add an organizer name']
    },
    contact: {
      email: {
        type: String
      },
      phone: {
        type: String
      },
      website: {
        type: String
      }
    }
  },
  features: {
    familyFriendly: { type: Boolean, default: false },
    accessible: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    outdoor: { type: Boolean, default: false },
    free: { type: Boolean, default: false }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDeleted:{
    type : Boolean,
    default : false
  }
},{
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on'
    }
});

EventSchema.pre('save', function(next){
    if(!this.slug){
        this.slug = slugify('e-' + this.name, {lower: true})
    }
      next();
})


// Create index for geospatial queries
EventSchema.index({ 'location.coordinates': '2dsphere' });

// Create index for date searches
EventSchema.index({ 'date.start': 1, 'date.end': 1 });

module.exports = mongoose.model('Event', EventSchema); 