import { Router } from 'express';
import { Category } from '../db';

export const pageRouter = Router();

pageRouter.get('/admin', (req, res) => {
  res.send('admin panel');
});

pageRouter.get('/db/:category/words', async (req, res) => {
  const isCategoreExist = await Category.findOne({ caption: req.params.category });
  console.log(isCategoreExist);
  if (!isCategoreExist) res.redirect('/db/category');

  res.send('Category exist');
});
