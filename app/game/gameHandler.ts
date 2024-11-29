import {
  GameTypeParameter,
  GameState,
  LengthParameter,
  SentenceParameter,
  Quote,
  getLengthByStringParameter,
  valueStringToKeyFormat,
} from "@app/types/GameParameters";
import words from "@scrapping/words.json";
import quotes from "@scrapping/quotesSorted.json";

const fetchQuote = (len: LengthParameter): Quote => {
  const quoteSection = quotes[valueStringToKeyFormat(len)];
  const quote =
    quoteSection[Math.floor(Math.random() * Object.keys(quoteSection).length)];
  const quoteObject: Quote = {
    id: quote.id,
    content: quote.content,
    author: quote.author,
    length: quote.length,
    tags: quote.tags,
  };

  return quoteObject;
};

const fetchRandomSentence = (len: LengthParameter): string => {
  const wordKeys: string[] = Object.keys(words);
  const wordCount = wordKeys.length;

  const targetLength = getLengthByStringParameter(valueStringToKeyFormat(len));
  const wordList: string[] = [];
  const randomRange =
    len === LengthParameter.SHORT
      ? Math.random() * (targetLength - (targetLength - 5)) + targetLength - 5
      : Math.random() * (targetLength - (targetLength - 15)) +
        targetLength -
        10;

  while (wordList.length < randomRange) {
    const randomIndex = Math.floor(Math.random() * wordCount);
    wordList.push(wordKeys[randomIndex]);
  }

  wordList[0] = wordList[0].charAt(0).toUpperCase() + wordList[0].slice(1);
  return wordList.join(" ");
};

export { fetchQuote, fetchRandomSentence };
