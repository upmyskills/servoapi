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

const createCategory = (categoryObj: ICategoryObj) => {
  const { caption } = categoryObj;
  const category = new Category({
    caption
  });

  return category.save();
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
