import "./styles.css";
import { useState } from "react";
import { players, Player } from "./input/players";
import { aiming_for } from "./input/aiming_for";
import { PlayerTable } from "./components/PlayerTable";
import { GoalStats } from "./components/GoalStats";
import { PlayerDrafter } from "./components/PlayerDrafter";
import { CurrentTeams } from "./components/Team";
import {
  PuntingCategories,
  PuntedCategory
} from "./components/PuntingCategories";
import { Teams, default_teams } from "./util/team";

const get_stats_left = (team: Player[]) => {
  const summed_stats = {
    points: 0,
    ast: 0,
    reb: 0,
    stl: 0,
    blk: 0,
    to: 0,
    tpm: 0,
    fgm: 0,
    ftm: 0
  };
  team.forEach((player) => {
    summed_stats.points += player.points;
    summed_stats.ast += player.ast;
    summed_stats.reb += player.reb;
    summed_stats.stl += player.stl;
    summed_stats.blk += player.blk;
    summed_stats.to += player.to;
    summed_stats.tpm += player.tpm;
    summed_stats.fgm += player.fgm;
    summed_stats.ftm += player.ftm;
  });
  return {
    points: 1 - Math.min(0.9, Math.sqrt(summed_stats.points / aiming_for.pts)),
    ast: 1 - Math.min(0.9, Math.sqrt(summed_stats.ast / aiming_for.ast)),
    reb: 1 - Math.min(0.9, Math.sqrt(summed_stats.reb / aiming_for.reb)),
    stl: 1 - Math.min(0.9, Math.sqrt(summed_stats.stl / aiming_for.stl)),
    blk: 1 - Math.min(0.9, Math.sqrt(summed_stats.blk / aiming_for.blk)),
    to: 1 - Math.min(0.9, Math.sqrt(summed_stats.to / aiming_for.to)),
    tpm: 1 - Math.min(0.9, Math.sqrt(summed_stats.tpm / aiming_for.tpm)),
    fgm: 1 - Math.min(0.9, Math.sqrt(summed_stats.fgm / aiming_for.fgm)),
    ftm: 1 - Math.min(0.9, Math.sqrt(summed_stats.ftm / aiming_for.ftm))
  };
};

const flatDeep = (arr, d = 1) => {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
        []
      )
    : arr.slice();
};

export default function App() {
  const [teams, setTeams] = useState<Teams>(default_teams);
  const addPlayer = (team: keyof Teams, player_id: number) => {
    const updated_teams = { ...teams };
    const foundPlayer = players.find((p) => p.id === player_id);
    if (foundPlayer) {
      updated_teams[team].push(foundPlayer);
      setTeams(updated_teams);
    } else {
      console.error(`Can't find added player id: ${player_id}`);
    }
  };

  const draftedPlayers = flatDeep(
    Object.keys(teams).map((teamName) => teams[teamName as keyof Teams]),
    Infinity
  ).map((pl: Player) => pl.id);

  const [categories, setCategories] = useState<PuntedCategory[]>([]);
  const updateCategory = (name: PuntedCategory) => {
    const ind = categories.indexOf(name);

    const newCategories = [...categories];
    if (ind > -1) {
      newCategories.splice(ind, 1);
    } else {
      newCategories.push(name);
    }

    setCategories(newCategories);
  };

  const otherPlayers = Object.keys(teams)
    .filter((t) => t !== "me")
    .map((t) => {
      return (
        <div key={t}>
          <h2>{t}</h2>
          <GoalStats stats={aiming_for} team={teams[t as keyof Teams]} />
        </div>
      );
    });

  const players_left = players.filter(
    (player) => draftedPlayers.indexOf(player.id) < 0
  );

  const statsLeft = get_stats_left(teams.me);
  return (
    <div className="App">
      <GoalStats stats={aiming_for} team={teams.me} />
      <CurrentTeams teams={teams} />
      <PlayerDrafter addPlayer={addPlayer} />
      <PuntingCategories
        categories={categories}
        updateCategory={updateCategory}
      />
      <PlayerTable
        players={players_left}
        playersLeft={Math.max(90 - draftedPlayers.length, 30)}
        puntedCategories={categories}
        statsLeft={statsLeft}
      />
      {otherPlayers}
    </div>
  );
}
