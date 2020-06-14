import natural from "natural";

natural.PorterStemmer.attach();

export const stem = async (text: any) => {
  if (!text) {
    throw new Error(`!!! Undefined text to stem word: ${text}`);
  }

  const stem = (await text.tokenizeAndStem()) || -1;

  return stem;
};

export default stem;
