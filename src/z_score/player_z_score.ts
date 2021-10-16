import { PuntedCategory } from "../components/PuntingCategories";
import { Player, Position } from "../input/players";
import { ZScoreFn, ZScoreRateFn } from "../z_score/counting_stat";

export interface PlayerWithZScore {
  id: number;
  name: string;
  positions: Position[];
  pts_z: string;
  reb_z: string;
  ast_z: string;
  stl_z: string;
  blk_z: string;
  tpm_z: string;
  fg_z: string;
  ft_z: string;
  to_z: string;
  punted_score: string;
  tot_score: string;
}

export interface PlayerWithRanking extends PlayerWithZScore {
  rank: string;
}

interface PlayersWithZScoreProps {
  players: Player[];
  punted_categories: PuntedCategory[];
  pts_z_fn: ZScoreFn;
  reb_z_fn: ZScoreFn;
  ast_z_fn: ZScoreFn;
  stl_z_fn: ZScoreFn;
  blk_z_fn: ZScoreFn;
  tpm_z_fn: ZScoreFn;
  fg_z_fn: ZScoreRateFn;
  ft_z_fn: ZScoreRateFn;
  to_z_fn: ZScoreFn;
}

const addIfNoPunt = (
  num: string,
  punted_categories: PuntedCategory[],
  categoryName: PuntedCategory
) => {
  return punted_categories.indexOf(categoryName) > -1 ? 0 : parseFloat(num);
};

export const getPlayersWithZScore = ({
  players,
  punted_categories,
  pts_z_fn,
  reb_z_fn,
  ast_z_fn,
  stl_z_fn,
  blk_z_fn,
  tpm_z_fn,
  fg_z_fn,
  ft_z_fn,
  to_z_fn
}: PlayersWithZScoreProps): PlayerWithZScore[] => {
  return players.map((player) => {
    const pts_z = pts_z_fn(player.points);
    const reb_z = reb_z_fn(player.reb);
    const ast_z = ast_z_fn(player.ast);
    const stl_z = stl_z_fn(player.stl);
    const blk_z = blk_z_fn(player.blk);
    const tpm_z = tpm_z_fn(player.tpm);
    const fg_z = fg_z_fn(player.fgm, player.fga);
    const ft_z = ft_z_fn(player.ftm, player.fta);
    const to_z = to_z_fn(player.to);

    const punted_score = (
      addIfNoPunt(pts_z, punted_categories, "pts") +
      addIfNoPunt(reb_z, punted_categories, "reb") +
      addIfNoPunt(ast_z, punted_categories, "ast") +
      addIfNoPunt(stl_z, punted_categories, "stl") +
      addIfNoPunt(blk_z, punted_categories, "blk") +
      addIfNoPunt(tpm_z, punted_categories, "tpm") +
      addIfNoPunt(fg_z, punted_categories, "fgp") +
      addIfNoPunt(ft_z, punted_categories, "ftp") +
      addIfNoPunt(to_z, punted_categories, "to")
    ).toFixed(2);

    const tot_score = (
      parseFloat(pts_z) +
      parseFloat(reb_z) +
      parseFloat(ast_z) +
      parseFloat(stl_z) +
      parseFloat(blk_z) +
      parseFloat(tpm_z) +
      parseFloat(fg_z) +
      parseFloat(ft_z) +
      parseFloat(to_z)
    ).toFixed(2);
    return {
      id: player.id,
      name: player.name,
      positions: player.positions,
      pts_z,
      reb_z,
      ast_z,
      stl_z,
      blk_z,
      tpm_z,
      fg_z,
      ft_z,
      to_z,
      punted_score,
      tot_score
    };
  });
};

export const getPlayersWithRankings = (
  players: PlayerWithZScore[],
  noPuntRanks: Record<Position, number[]>,
  puntRanks: Record<Position, number[]>
): PlayerWithRanking[] => {
  return players.map((player) => {
    return {
      ...player,
      rank: player.positions
        .map((position) => {
          const noPuntRank = noPuntRanks[position].indexOf(player.id);
          const puntRank = puntRanks[position].indexOf(player.id);
          return `${position} ${
            puntRank < noPuntRank ? "+" : noPuntRank < puntRank ? "-" : ""
          }${Math.abs(puntRank - noPuntRank)} (${puntRank})`;
        })
        .join("; ")
    };
  });
};
