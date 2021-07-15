import Router from 'express';
import { createWord } from '../db/dbServices';

import { Category } from '../db';

const dbRouter = Router();
const baseRoute = '/db/category';

dbRouter.get(`${baseRoute}`, async (req, res) => {
  const response = await Category.find();
  res.json(response);
});

dbRouter.post(`${baseRoute}`, async (req, res) => {
  const response = await Category.find();
  console.log(req.body);
  res.json(response);
});

dbRouter.post(`${baseRoute}/create`, async (req, res) => {
  const { categoryCaption } = req.body;
  const query = await Category.findOne({ caption: categoryCaption });

  if (!query) {
    try {
      Category.create({ caption: categoryCaption });
      res.sendStatus(201);
    } catch (e) {
      res.sendStatus(503);
    }
  } else {
    res.send('Category already exist');
  }
});

dbRouter.delete(`${baseRoute}/delete/:categoryCaption`, async (req, res) => {
  const { categoryCaption } = req.params;

  try {
    const query = await Category.deleteOne({ caption: categoryCaption });

    if (query.deletedCount) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    };
  } catch (e) {
    res.sendStatus(500);
  }
});

dbRouter.get(`${baseRoute}/addword`, async (req, res) => {
  const { word, translation, audioSrc, image, category } = req.body;
  const newWord = {
    word,
    translation,
    audioSrc,
    image,
    category
  }

  const isCreated = await createWord(newWord);
  
  if (isCreated) {
    res.sendStatus(201);
  } else {
    res.sendStatus(404);
  }
});

export { dbRouter };
