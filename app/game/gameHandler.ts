import {
  LengthParameter,
  Quote,
  valueStringToKeyFormat,
} from "@app/types/GameParameters";
import quotes from "@scrapping/quotesSorted.json";
import words from "@scrapping/words.json";

const fetchQuote = (len: LengthParameter): Quote => {
  const key = valueStringToKeyFormat(len) as keyof typeof quotes;
  const quoteSection = quotes[key];
  const quote =
    quoteSection[Math.floor(Math.random() * Object.keys(quoteSection).length)];
  const quoteObject: Quote = {
    _id: quote._id,
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
  
  const key = valueStringToKeyFormat(len) as keyof typeof quotes;
  const quoteSection = quotes[key];
  const quoteLengths = Object.values(quoteSection).map(quote => quote.content.length);
  const averageQuoteLength = Math.floor(
    quoteLengths.reduce((acc, curr) => acc + curr, 0) / quoteLengths.length
  );

  const variation = Math.floor(averageQuoteLength * 0.1);
  const targetLength = averageQuoteLength + (Math.random() * variation * 2 - variation);

  const wordList: string[] = [];
  let currentLength = 0;

  while (currentLength < targetLength) {
    const randomIndex = Math.floor(Math.random() * wordCount);
    const word = wordKeys[randomIndex];

    if (currentLength + word.length + 1 <= targetLength + 5) {
      wordList.push(word);
      currentLength += word.length + 1;
    } else {
      break;
    }
  }

  return wordList[0].charAt(0).toUpperCase() + wordList[0].slice(1) + 
         (wordList.length > 1 ? ' ' + wordList.slice(1).join(' ') : '') + 
         '.';
};

export { fetchQuote, fetchRandomSentence };
