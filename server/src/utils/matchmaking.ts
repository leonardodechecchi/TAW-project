export function createRatingSystem(kFactor = 32, exponentDenominator = 400, exponentBase = 10) {
  // Standard Elo implementation with symmetric kfactor functions for each player
  // This would be a true zero-sum game where A(-x) = B(+x)
  const getPlayerProbabilities = createPlayerProbabilitiesFn(exponentBase, exponentDenominator);
  const getNextRating = createNextRatingFn(kFactor);

  return {
    getPlayerProbabilities,
    getNextRating,
  };
}

// E = 1 / (1 + exponentBase ^ (ratingDifference) / exponentDenominator)
function createBaseExpectedPlayerProbabilityFn(exponentBase: number, exponentDenominator: number) {
  return (ratingDifference: number): number => {
    const exponent = ratingDifference / exponentDenominator;
    return 1 / (1 + Math.pow(exponentBase, exponent));
  };
}

/** ================================================================================================== */

type ExpectedProbabilitiesFn = (
  playerARating: number,
  playerBRating: number
) => [
  playerAProbability: number,
  playerBProbability: number,
  ratingADifference: number,
  ratingBDifference: number
];

function createPlayerProbabilitiesFn(
  exponentBase: number,
  exponentDenominator: number
): ExpectedProbabilitiesFn {
  // get the function that calculate the expected player probability
  const expectedPlayerProbabilityFn = createBaseExpectedPlayerProbabilityFn(
    exponentBase,
    exponentDenominator
  );

  const expectedPlayerProbability: ExpectedProbabilitiesFn = (playerARating, playerBRating) => {
    const ratingADifference = playerBRating - playerARating;
    const ratingBDifference = playerARating - playerBRating;

    const playerAProbability = expectedPlayerProbabilityFn(ratingADifference);
    const playerBProbability = expectedPlayerProbabilityFn(ratingBDifference);

    return [playerAProbability, playerBProbability, ratingADifference, ratingBDifference];
  };

  return expectedPlayerProbability;

  /** ================================================================================================== */

  type NextRatingsFn = (
    playerARating: number,
    playerBRating: number,
    playerAScore: number
  ) => {
    playerAProbability: number;
    playerBProbability: number;
    nextPlayerARating: number;
    playerARatingDiff: number;
    nextPlayerBRating: number;
    playerBRatingDiff: number;
  };

  /**
   *
   * @param getExpectedPlayerProbabilities
   * @param getNextARating
   * @param getNextBRating
   * @returns
   */
  function createNextRatingsFn(
    getExpectedPlayerProbabilities: ExpectedProbabilitiesFn,
    getNextARating: NextRatingFn,
    getNextBRating: NextRatingFn
  ): NextRatingsFn {
    const nextRatingsFn = (playerARating: number, playerBRating: number, playerAScore: number) => {
      const [expectedPlayerAProbability, expectedPlayerBProbability] =
        getExpectedPlayerProbabilities(playerARating, playerBRating);
      const aProbability = playerAScore;
      const bProbability = 1 - playerAScore;

      const [nextPlayerARating, playerARatingDiff] = getNextARating(
        playerARating,
        aProbability,
        expectedPlayerAProbability
      );
      const [nextPlayerBRating, playerBRatingDiff] = getNextBRating(
        playerBRating,
        bProbability,
        expectedPlayerBProbability
      );

      return {
        playerAProbability: expectedPlayerAProbability,
        playerBProbability: expectedPlayerBProbability,
        nextPlayerARating,
        playerARatingDiff,
        nextPlayerBRating,
        playerBRatingDiff,
      };
    };

    return nextRatingsFn;
  }

  /** ================================================================================================== */
}

/** ================================================================================================== */

type NextRatingFn = (
  rating: number,
  actualPoints: number,
  expectedPoints: number
) => [nextRating: number, ratingChange: number];
type KFactorFunction = (rating: number) => number;

function createNextRatingFn(kFactor: number | KFactorFunction): NextRatingFn {
  const kFactorFn: KFactorFunction = typeof kFactor === 'number' ? () => kFactor : kFactor;

  return (rating: number, actualPoints: number, expectedPoints: number): [number, number] => {
    const change = Math.round(kFactorFn(rating) * (actualPoints - expectedPoints));
    const nextRating = rating + change;

    return [nextRating, change];
  };
}
