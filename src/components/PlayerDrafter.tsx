import { useState } from "react";

import { Teams } from "../util/team";

interface PlayerDrafterProps {
  addPlayer: (team: keyof Teams, player_id: number) => void;
}

const teams: (keyof Teams)[] = [
  "me",
  "irvin",
  "tomas",
  "josh",
  "dan",
  "john",
  "michael",
  "alex"
];

export const PlayerDrafter = ({ addPlayer }: PlayerDrafterProps) => {
  const [targetPlayer, setTargetPlayer] = useState<number>(0);
  const [team, setTeam] = useState("me");
  const teamOptions = teams.map((t) => {
    return (
      <option key={t} value={t}>
        {t}
      </option>
    );
  });
  return (
    <>
      <input
        type="text"
        value={targetPlayer}
        onInput={(e) => {
          const newInput = e.target.value;
          let inp;
          try {
            inp = parseInt(newInput, 10);
          } catch {
            return;
          }
          setTargetPlayer(inp);
        }}
      />
      <select
        value={team}
        onChange={(e) => {
          setTeam(e.target.value);
        }}
      >
        {teamOptions}
      </select>
      <input
        type="submit"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          addPlayer(team as keyof Teams, targetPlayer);
        }}
        value="Draft"
      />
    </>
  );
};
