const mongoose = require('mongoose');
const slugify = require('slugify');

const DiningSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    cuisine: {
        type: [String],
        required: [true, 'Please specify at least one cuisine type'],
        enum: [
            'Bakery',
            'Bar Food',
            'Barbecue',
            'Cafe',
            'Chinese',
            'Continental',
            'Fast Food',
            'Indian',
            'International',
            'Italian',
            'Mediterranean',
            'Mughlai',
            'Multi-cuisine',
            'North Indian',
            'Punjabi',
            'South Indian',
            'Street Food',
            'Vegetarian'
        ]
    },
    category: {
        type: String,
        enum: ['Street Food', 'Casual Dining', 'Fine Dining', 'Cafe/Bakery', 'Other'],
        required: true
    },
    famousDishes: [String],
    location: {
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        city: {
            type: String,
            required: [true, 'Please specify the city']
        },
        state: {
            type: String,
            required: [true, 'Please specify the state']
        },
        country: {
            type: String
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
    images: [
        {
            url: {
                type: String,
                required: true
            },
            altText: {
                type: String,
                default: 'Dining Image'
            },
            publicId: {
                type: String,
                required: [true, "Missing cloud Sub-Image public id"]
            }
        }
    ],
    mainImage: {
        type: String,
        required: [true, 'Please add a main image URL']
    },
    mainImagePublicId: {
        type: String,
        required: [true, "Missing cloud Main-Image public id"]
    },
    openingHours: {
        monday: { type: String, default: 'Closed' },
        tuesday: { type: String, default: 'Closed' },
        wednesday: { type: String, default: 'Closed' },
        thursday: { type: String, default: 'Closed' },
        friday: { type: String, default: 'Closed' },
        saturday: { type: String, default: 'Closed' },
        sunday: { type: String, default: 'Closed' }
    },
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$'],
        default: '$$'
    },
    features: {
        delivery: { type: Boolean, default: false },
        takeout: { type: Boolean, default: false },
        outdoorSeating: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        wifi: { type: Boolean, default: false },
        acceptsReservations: { type: Boolean, default: false }
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        default: 4
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isFeatured :{
        type : Boolean,
        default : false
    }
}, {
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    }
});

DiningSchema.pre('save', function (next) {
    if (!this.slug) {
        const baseSlug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true,
        });
        this.slug = `D-${baseSlug}`;
    }
    next();
});

DiningSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Dining', DiningSchema);
