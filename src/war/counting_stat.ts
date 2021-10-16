import { Player } from "../input/players";

export const calculateZScore = (players: Player[], playersLeft: number) => {
  players.sort((a: Player, b: Player) => {
    return a.points > b.points ? 1 : a.points < b.points ? -1 : 0;
  });
};
