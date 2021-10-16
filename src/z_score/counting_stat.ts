import { Player } from "../input/players";
import { getStandardDeviation } from "../util/get_standard_deviation";
import { getAverage } from "../util/get_average";

export type ZScoreFn = (num: number) => string;
export type ZScoreRateFn = (made: number, attempted: number) => string;

export const getZScoreFn = (
  players: Player[],
  playersLeft: number,
  statName: keyof Player,
  statsLeft: Record<string, number>
): ZScoreFn => {
  let mod = statName === "to" ? -1 : 1;

  players.sort((a: Player, b: Player) => {
    return (
      (a[statName] > b[statName] ? -1 : a[statName] < b[statName] ? 1 : 0) * mod
    );
  });

  mod = mod === -1 ? -0.1 : 1;

  const top_n_players = players.slice(0, playersLeft);

  const stat_arr = top_n_players.map((player) => player[statName]);

  const avg = getAverage(stat_arr as number[]);
  const std_dev = getStandardDeviation(stat_arr as number[]);
  const statMod = statsLeft[statName];

  return (num: number) => (((num - avg) * mod * statMod) / std_dev).toFixed(2);
};

export const getZScoreFnForRate = (
  players: Player[],
  playersLeft: number,
  statName: "fg" | "ft",
  statsLeft: Record<string, number>
): ZScoreRateFn => {
  players.sort((a: Player, b: Player) => {
    // @ts-ignore
    return a[statName + "m"] > b[statName + "m"]
      ? 1
      : // @ts-ignore
      a[statName + "m"] < b[statName + "m"]
      ? -1
      : 0;
  });

  const top_n_players = players.slice(0, playersLeft);

  // @ts-ignore
  const made_stat_arr = top_n_players.map((player) => player[statName + "m"]);
  const made_avg = getAverage(made_stat_arr as number[]);
  const made_std_dev = getStandardDeviation(made_stat_arr as number[]);

  players.sort((a: Player, b: Player) => {
    // @ts-ignore
    const a_rate = a[statName + "m"] / a[statName + "a"];
    // @ts-ignore
    const b_rate = b[statName + "m"] / b[statName + "a"];
    return a_rate > b_rate ? -1 : a_rate < b_rate ? 1 : 0;
  });

  const rate_stat_arr = top_n_players.map(
    // @ts-ignore
    (player) => player[statName + "m"] / player[statName + "a"]
  );
  const rate_avg = getAverage(rate_stat_arr as number[]);
  const rate_std_dev = getStandardDeviation(rate_stat_arr as number[]);

  const statMod = statsLeft[statName + "m"];

  return (made: number, attempted: number) => {
    const made_z = (made - made_avg) / made_std_dev;
    const rate_z = (made / attempted - rate_avg) / rate_std_dev;

    return ((made_z * 0.5 + rate_z * 0.5) * 0.2 * statMod).toFixed(2);
  };
};
