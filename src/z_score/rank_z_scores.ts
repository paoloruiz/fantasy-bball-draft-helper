import { Position } from "../input/players";
import { PlayerWithZScore } from "./player_z_score";

const rankPosition = (
  players: PlayerWithZScore[],
  punts: boolean,
  position: Position
): number[] => {
  return players
    .filter((player) => player.positions.indexOf(position) > -1)
    .map((player) => {
      return {
        id: player.id,
        score: parseFloat(punts ? player.punted_score : player.tot_score)
      };
    })
    .sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0))
    .map((player) => player.id);
};

export const rankPlayers = (
  players: PlayerWithZScore[],
  punts: boolean
): Record<Position, number[]> => {
  return {
    PG: rankPosition(players, punts, "PG"),
    SG: rankPosition(players, punts, "SG"),
    SF: rankPosition(players, punts, "SF"),
    PF: rankPosition(players, punts, "PF"),
    C: rankPosition(players, punts, "C")
  };
};
