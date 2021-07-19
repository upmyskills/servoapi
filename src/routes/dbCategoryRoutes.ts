import Router from 'express';
import { createWord, createCategory, getAllCategories, getCategoryByCaption, updateCategory, deleteCategory } from '../db/dbServices';

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

dbCategoryRouter.delete(`${dbCategory}/:categoryCaption`, async (req, res) => {
  const { categoryCaption } = req.params;

  try {
    const query = await deleteCategory(categoryCaption);
    // TODO: also we need to delete all cards in this category

    if (query) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    };
  } catch (e) {
    res.sendStatus(500);
  }
});

dbCategoryRouter.put(`${dbCategory}/:urlCategoryCaption`, async (req, res) => {
  const { urlCategoryCaption } = req.params;
  const { newCategoryCaption } = req.body;
  const categoryCaption = urlCategoryCaption.replace(/_/g, ' ');

  const query = await getCategoryByCaption(categoryCaption);
  const isCategoryExist = await getCategoryByCaption(newCategoryCaption);

  if (!query || !newCategoryCaption) {
    res.sendStatus(404);
    return;
  };

  if (isCategoryExist) {
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

dbCategoryRouter.post(`${dbCategory}/:categoryCaption/addword`, async (req, res) => {
  const { word, translation, audioSrc, image } = req.body;
  const { categoryCaption } = req.params;

  const newWord = {
    word,
    translation,
    audioSrc,
    image,
    category: categoryCaption
  }

  try {
    await createWord(newWord);
    res.sendStatus(201);
  } catch (e) {
    res.status(404).json(`Can't create word in ${categoryCaption} category.`);
  }
});

export { dbCategoryRouter };
