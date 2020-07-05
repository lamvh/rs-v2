export interface ConfigArgs {
  nearestNeighbors?: number;
  className?: string;
  numOfRecsStore?: number;
  factorLeastSimilarLeastLiked?: boolean;
  redisUrl?: string;
  redisPort?: number;
  redisAuth?: string;
}
export default class Config {
  nearestNeighbors: number;
  className: string;
  numOfRecsStore: number;
  factorLeastSimilarLeastLiked: boolean;
  redisUrl: string;
  redisPort: number;
  redisAuth: string;
  constructor({
    nearestNeighbors,
    className,
    numOfRecsStore,
    factorLeastSimilarLeastLiked,
    redisUrl,
    redisPort,
    redisAuth,
  }: ConfigArgs);
}
