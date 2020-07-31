export type trained = {
  id: number;
  recommend: number[];
  type: trainTypeEnum;
};

enum trainTypeEnum {
  cf = "cf",
  raccoon = "raccoon",
}
