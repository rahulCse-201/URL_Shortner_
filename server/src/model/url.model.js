import mongoose, {Schema} from 'mongoose';

const urlSchema = new Schema({
    originalUrl:{
        type: String,
        required: true
    },
    // shortUrl:{
    //     type: String,
    //     required: true
    // },
    shortCode:{
        type: String,
        required: true,
        unique: true   // this will help to avoid duplicate short codes in the database
    },
    clicks:{
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
},{timestamps: true});

const Url = mongoose.model('Url', urlSchema);

export default Url;