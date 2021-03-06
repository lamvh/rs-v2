import Raccoon from "../algorithm/raccoon/lib2";

const REDIS_URL = process.env.REDIS_URL;
const CLASS_NAME = "Recommendation_System";

export const initRedis = async (): Promise<Raccoon> => {
  if (!REDIS_URL) {
    throw new Error("!!! REDIS URL not found");
  }

  const raccoon = new Raccoon({
    className: CLASS_NAME,
    redisUrl: REDIS_URL,
  });

  // if (!raccoon) {
  //   throw new Error(
  //     `Can not create Raccoon, className: ${CLASS_NAME} redisUrl: ${REDIS_URL}`
  //   );
  // }

  console.log("--- RACCOON class name:", CLASS_NAME);
  console.log("--- RACCOON redis:", REDIS_URL);

  return raccoon;
};

export default initRedis;
