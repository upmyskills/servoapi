import { Category, Word } from '.';


interface IWordObj {
  word: string,
  translation: string,
  audioSrc: string,
  image: string,
  category: string
}

interface ICategoryObj {
  caption: string,
}

export const getAllCategories = async (): Promise<Array<ICategoryObj>> => {
  const query = await Category.find();
 
  return query;
}

export const getCategoryByCaption = async (caption: string): Promise<ICategoryObj> => {
  const query = await Category.findOne({ caption });

  return query;
}

export const updateCategory = async (currentCategory: ICategoryObj, newCategoryCaption: string): Promise<boolean> => {
  const { caption } = currentCategory;

  const query = await Category.updateOne({ caption }, { caption: newCategoryCaption });

  return query.nModified;
}

export const createCategory = async (categoryObj: ICategoryObj): Promise<void> => {
  const { caption } = categoryObj;
  const category = await Category.create({
    caption
  });

  return category;
}

export const createWord = async (wordObj: IWordObj) => {
  const { word, translation, audioSrc, image, category } = wordObj;
  const categoryQuery = await Category.findOne({ caption: category });

  if (categoryQuery) {
    const engWord = new Word({
      word,
      translation,
      audioSrc,
      image,
      category: categoryQuery
    });

    return engWord.save();
  }

  return null;
}
