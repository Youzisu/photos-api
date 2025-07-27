import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const photoSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  tags: {
    type: [String],
    required: false,
    default: []
  }
}, {
  timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;