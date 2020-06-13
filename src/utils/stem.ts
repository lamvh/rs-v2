import natural from "natural";

natural.PorterStemmer.attach();

export const stem = async (text: any) => {
  const stem = await text.tokenizeAndStem();
  console.log(stem);
  return stem;
};

export default stem;
