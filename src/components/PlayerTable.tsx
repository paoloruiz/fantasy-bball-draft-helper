import React from "react";
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
}

export const PlayerTable = ({
  players,
  playersLeft,
  puntedCategories
}: PlayerTableProps) => {
  const pts_z_fn = getZScoreFn(players, playersLeft, "points");
  const ast_z_fn = getZScoreFn(players, playersLeft, "ast");
  const reb_z_fn = getZScoreFn(players, playersLeft, "reb");
  const stl_z_fn = getZScoreFn(players, playersLeft, "stl");
  const blk_z_fn = getZScoreFn(players, playersLeft, "blk");
  const tpm_z_fn = getZScoreFn(players, playersLeft, "tpm");

  const fg_z_fn = getZScoreFnForRate(players, playersLeft, "fg");
  const ft_z_fn = getZScoreFnForRate(players, playersLeft, "ft");

  const to_z_fn = getZScoreFn(players, playersLeft, "to");

  const columns = React.useMemo<Column<PlayerWithRanking>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Positions",
        accessor: "positions"
      },
      {
        Header: "Points",
        accessor: "pts_z"
      },
      {
        Header: "Assists",
        accessor: "ast_z"
      },
      {
        Header: "Rebounds",
        accessor: "reb_z"
      },
      {
        Header: "Steals",
        accessor: "stl_z"
      },
      {
        Header: "Blocks",
        accessor: "blk_z"
      },
      {
        Header: "3PM",
        accessor: "tpm_z"
      },
      {
        Header: "FG%",
        accessor: "fg_z"
      },
      {
        Header: "FT%",
        accessor: "ft_z"
      },
      {
        Header: "TO",
        accessor: "to_z"
      },
      {
        Header: "Score",
        accessor: "punted_score"
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
