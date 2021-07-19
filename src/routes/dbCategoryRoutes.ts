import Router from 'express';
import { createWord, createCategory, getAllCategories, getCategoryByCaption, updateCategory } from '../db/dbServices';

import { Category } from '../db';

const dbCategoryRouter = Router();
const dbCategory = '/db/category';

dbCategoryRouter.get(`${dbCategory}`, async (req, res) => {
  const categories = await getAllCategories();
  res.json(categories);
});

dbCategoryRouter.post(`${dbCategory}/create`, async (req, res) => {
  const { categoryCaption } = req.body;

  if (!categoryCaption) {
    res.sendStatus(404);
    return;
  };

  const queryCategory = await getCategoryByCaption(categoryCaption);

  if (!queryCategory) {
    try {
      await createCategory({ caption: categoryCaption });
      res.sendStatus(201);
    } catch (e) {
      res.status(404).json({ errorMessage: `Can't create new entry(${categoryCaption})` });
    }
  } else {
    res.json({ errorMessage: "Category already exist!" });
  }
});

dbCategoryRouter.delete(`${dbCategory}/:categoryCaption/delete`, async (req, res) => {
  const { categoryCaption } = req.params;

  try {
    const query = await Category.deleteOne({ caption: categoryCaption });
    // TODO: also we need to delete all cards with this category

    if (query.deletedCount) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    };
  } catch (e) {
    res.sendStatus(500);
  }
});

dbCategoryRouter.put(`${dbCategory}/:urlCategoryCaption/update`, async (req, res) => {
  const { urlCategoryCaption } = req.params;
  const { newCategoryCaption } = req.body;
  const categoryCaption = urlCategoryCaption.replace(/_/g, ' ');

  const query = await getCategoryByCaption(categoryCaption);
  const isEntryExist = await getCategoryByCaption(newCategoryCaption);

  if (!query || !newCategoryCaption) {
    res.sendStatus(404);
    return;
  };

  if (isEntryExist) {
    res.status(404).json({ errorMessage: `${newCategoryCaption} already exist. Cho0se another caption please!` });
    return;
  }
  
  const updatedEntry = {
    prev: query.caption, 
    new: newCategoryCaption
  };

  try {
    const isUpdated = await updateCategory(query, newCategoryCaption);
    res.json(updatedEntry);
  } catch (e) {
    console.log(e);
    res.json({ errorMessage: "Something was wrong." });
  }

});

dbCategoryRouter.get(`${dbCategory}/:categoryCaption/addword`, async (req, res) => {
  const { word, translation, audioSrc, image, category } = req.body;
  const { categoryCaption } = req.params;

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

export { dbCategoryRouter };
