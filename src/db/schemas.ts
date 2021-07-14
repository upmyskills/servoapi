import mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
  caption: {type: String, require: true, unique: true},
});

export const wordSchema = new mongoose.Schema({
  word: String,
  translation: String,
  audioSrc: Buffer,
  image: Buffer,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' }
});
