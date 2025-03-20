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

  const quoteIds = Object.keys(quoteSection);
  
  
  let quote =
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

const fetchRandomSentence = (len: LengthParameter, language: string): string => {
  const languageWords = words[language as keyof typeof words] as string[];
  if (!languageWords || languageWords.length === 0) {
    throw new Error(`Language ${language} not found in words dictionary or is empty`);
  }
  
  const wordCount = {
    "short": 10,
    "medium": 15,
    "long": 20,
    "very_long": 30
  }[valueStringToKeyFormat(len).toLowerCase()] || 8;
  
  let sentence = '';
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * languageWords.length);
    const word = languageWords[randomIndex];

    if(word === sentence.split(' ').at(i-1)) {
      i--;
      continue;
    }
    
    sentence += word + ' ';
  }
  
  return sentence.trimEnd();
};

export { fetchQuote, fetchRandomSentence };
