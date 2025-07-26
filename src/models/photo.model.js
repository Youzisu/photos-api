import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const photoSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;