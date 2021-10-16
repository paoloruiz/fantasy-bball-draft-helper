import React, { useMemo } from "react";
import { Column } from "react-table";
import { Player } from "../input/players";
import { getZScoreFn, getZScoreFnForRate } from "../z_score/counting_stat";
import {
  getPlayersWithZScore,
  PlayerWithZScore,
  PlayerWithRanking,
  getPlayersWithRankings
} from "../z_score/player_z_score";
import { rankPlayers } from "../z_score/rank_z_scores";
import { PuntedCategory } from "./PuntingCategories";
import Table from "./ReactPlayerTable";

interface PlayerTableProps {
  players: Player[];
  playersLeft: number;
  puntedCategories: PuntedCategory[];
  statsLeft: Record<string, number>;
}

const sortFn = (a, b, columnId) => {
  return Number(a.values[columnId]) > Number(b.values[columnId]) ? 1 : -1;
};

export const PlayerTable = ({
  players,
  playersLeft,
  puntedCategories,
  statsLeft
}: PlayerTableProps) => {
  const pts_z_fn = getZScoreFn(players, playersLeft, "points", statsLeft);
  const ast_z_fn = getZScoreFn(players, playersLeft, "ast", statsLeft);
  const reb_z_fn = getZScoreFn(players, playersLeft, "reb", statsLeft);
  const stl_z_fn = getZScoreFn(players, playersLeft, "stl", statsLeft);
  const blk_z_fn = getZScoreFn(players, playersLeft, "blk", statsLeft);
  const tpm_z_fn = getZScoreFn(players, playersLeft, "tpm", statsLeft);

  const fg_z_fn = getZScoreFnForRate(players, playersLeft, "fg", statsLeft);
  const ft_z_fn = getZScoreFnForRate(players, playersLeft, "ft", statsLeft);

  const to_z_fn = getZScoreFn(players, playersLeft, "to", statsLeft);

  const columns = React.useMemo<Column<PlayerWithRanking>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Name",
        accessor: "name",
        filter: "fuzzyText"
      },
      {
        Header: "Positions",
        accessor: "positions",
        filter: "fuzzyText"
      },
      {
        Header: "Points",
        accessor: "pts_z",
        sortType: sortFn
      },
      {
        Header: "Assists",
        accessor: "ast_z",
        sortType: sortFn
      },
      {
        Header: "Rebounds",
        accessor: "reb_z",
        sortType: sortFn
      },
      {
        Header: "Steals",
        accessor: "stl_z",
        sortType: sortFn
      },
      {
        Header: "Blocks",
        accessor: "blk_z",
        sortType: sortFn
      },
      {
        Header: "3PM",
        accessor: "tpm_z",
        sortType: sortFn
      },
      {
        Header: "FG%",
        accessor: "fg_z",
        sortType: sortFn
      },
      {
        Header: "FT%",
        accessor: "ft_z",
        sortType: sortFn
      },
      {
        Header: "TO",
        accessor: "to_z",
        sortType: sortFn
      },
      {
        Header: "Score",
        accessor: "punted_score",
        id: "sco",
        sortType: sortFn
      },
      {
        Header: "Rank",
        accessor: "rank"
      }
    ],
    []
  );

  const zScorePlayers = React.useMemo<PlayerWithZScore[]>(() => {
    return getPlayersWithZScore({
      players,
      punted_categories: puntedCategories,
      pts_z_fn,
      ast_z_fn,
      reb_z_fn,
      stl_z_fn,
      blk_z_fn,
      tpm_z_fn,
      fg_z_fn,
      ft_z_fn,
      to_z_fn
    });
  }, [
    players,
    puntedCategories,
    pts_z_fn,
    ast_z_fn,
    reb_z_fn,
    stl_z_fn,
    blk_z_fn,
    tpm_z_fn,
    fg_z_fn,
    ft_z_fn,
    to_z_fn
  ]);

  const rankedPlayersNoPunts = React.useMemo(
    () => rankPlayers(zScorePlayers, false),
    [zScorePlayers]
  );

  const rankedPlayersWithPunts = React.useMemo(
    () => rankPlayers(zScorePlayers, true),
    [zScorePlayers]
  );

  const rankedPlayers = React.useMemo<PlayerWithRanking[]>(() => {
    return getPlayersWithRankings(
      zScorePlayers,
      rankedPlayersNoPunts,
      rankedPlayersWithPunts
    );
  }, [zScorePlayers, rankedPlayersNoPunts, rankedPlayersWithPunts]);

  return <Table columns={columns} data={rankedPlayers} />;
};
