// tslint:disable-next-line: no-var-requires
const recommend = require("collaborative-filter");

//

export const addTable = async () => {
  const ratings = [
    //        Item  Item
    // User
    // User
    [1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ];

  const coMatrix = recommend.coMatrix(ratings, 5, 5);
  console.log(recommend.getRecommendations(ratings, coMatrix, 2));
  console.log(recommend.getRecommendations(ratings, coMatrix, 0));
  console.log(recommend.getRecommendations(ratings, coMatrix, 4));
};
