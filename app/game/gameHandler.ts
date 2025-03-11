import {
  LengthParameter,
  Quote,
  valueStringToKeyFormat,
} from "@app/types/GameParameters";
import quotes from "@scrapping/quotesSorted.json";
import words from "@scrapping/words.json";

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
  // Obtenir la longueur moyenne des quotes pour cette catégorie
  const quoteSection = quotes[valueStringToKeyFormat(len)];
  const quoteLengths = Object.values(quoteSection).map(quote => quote.content.length);
  const averageQuoteLength = Math.floor(
    quoteLengths.reduce((acc, curr) => acc + curr, 0) / quoteLengths.length
  );

  // Ajouter une variation aléatoire de ±10%
  const variation = Math.floor(averageQuoteLength * 0.1);
  const targetLength = averageQuoteLength + (Math.random() * variation * 2 - variation);

  const wordList: string[] = [];
  let currentLength = 0;

  while (currentLength < targetLength) {
    const randomIndex = Math.floor(Math.random() * wordCount);
    const word = wordKeys[randomIndex];

    // Ajouter le mot seulement s'il ne dépasse pas trop la longueur cible
    if (currentLength + word.length + 1 <= targetLength + 5) {
      wordList.push(word);
      currentLength += word.length + 1; // +1 pour l'espace
    } else {
      break;
    }
  }

  // Capitaliser la première lettre et ajouter un point
  return wordList[0].charAt(0).toUpperCase() + wordList[0].slice(1) + 
         (wordList.length > 1 ? ' ' + wordList.slice(1).join(' ') : '') + 
         '.';
};

export { fetchQuote, fetchRandomSentence };
