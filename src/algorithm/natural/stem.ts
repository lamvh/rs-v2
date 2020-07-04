import natural from "natural";

natural.PorterStemmer.attach();

export const getStem = async (text: any) => {
  if (!text) {
    return "";
  }

  const stem = (await text.tokenizeAndStem()) || -1;

  return stem;
};

export default getStem;
