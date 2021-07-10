import Router = require('express');
import { statka } from './const';
import { IStatisticParams } from '../models';

const baseRoute = Router();

const createNewEntry = (word: string): void => {
  statka.set((word as string).toLowerCase(), { count: 0, correct: 0, wrong: 0 });
};

const transformToList = (): Array<IStatisticParams> => {
  const objList = Object.fromEntries(statka);
  const words = Object.keys(objList).map((item) => statka.get(item));

  return words;
};

//    /api/auth
baseRoute.get('/', (req, res) => {
  res.send('<p style="font-size: xxx-large;text-align: center;">Test GET <span style="color: green;">oK</span>!</p>');
});

baseRoute.get('/checkanswer', (req, res) => {
  // word=move&correct=false
  const { word, correct } = req.query;

  if (!statka.has((word as string).toLowerCase())) {
    createNewEntry((word as string));
  }

  if (Number(correct)) statka.get(word).correct += 1;
  else statka.get(word).wrong += 1;

  res.status(200);
  res.send('ok');
});

baseRoute.get('/train', (req, res) => {
  console.log('trainBack');
  const { word } = req.query;
  if (!statka.has((word as string).toLowerCase())) {
    createNewEntry((word as string));
  }
  statka.get(word).count += 1;

  res.status(200);
  res.send('ok');
});

baseRoute.get('/load', async (req, res) => {
  const words = transformToList();

  res.json(words);
});

baseRoute.get('/sort', async (req, res) => {
  console.log(statka);
  const words = transformToList();
  const {sortBy, direction} = req.query;

  if (sortBy === 'word') words.sort((a, b) => a.word.localeCompare(b.word));
  if (sortBy === 'translate') words.sort((a, b) => a.translation.localeCompare(b.translation));
  if (sortBy === 'count') words.sort((a, b) => a.count - b.count).reverse();
  if (sortBy === 'correct') words.sort((a, b) => a.correct - b.correct).reverse();
  if (sortBy === 'wrong') words.sort((a, b) => a.wrong - b.wrong).reverse();
  if (sortBy === 'percent') words.sort((a, b) => {
    const aPercent = (100 / ((a.wrong + a.correct) || 1) * a.correct);
    const bPercent = (100 / ((b.wrong + b.correct) || 1) * b.correct);

    return aPercent - bPercent;
  }).reverse();


  if (direction === 'sort-up') words.reverse();
  
  res.json(words);
});

export { baseRoute };
