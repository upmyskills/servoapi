import { Schema } from 'mongoose';

export const categorySchema = new Schema({
  caption: { type: String, require: true },
});

export const wordSchema = new Schema({
  word: String,
  translation: String,
  audioSrc: Buffer,
  image: Buffer,
  category: { type: Schema.Types.ObjectId, ref: 'category' }
});
