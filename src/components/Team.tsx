import { Player } from "../input/players";
import { Teams } from "../util/team";

import "./Team.scss";

interface TeamProps {
  team: Player[];
}

const Team = ({ team }: TeamProps) => {
  const playerList = team.map((player) => (
    <span key={player.id}>{player.name}</span>
  ));
  return <div className="cur_team">{playerList}</div>;
};

interface CurrentTeamsProps {
  teams: Teams;
}

export const CurrentTeams = ({ teams }: CurrentTeamsProps) => {
  const curTeams = Object.keys(teams).map((teamName) => {
    return (
      <div className="individual_team" key={teamName}>
        <span>
          <b>{teamName}</b>
        </span>
        <Team team={teams[teamName as keyof Teams]} />
      </div>
    );
  });

  return <div className="current_teams">{curTeams}</div>;
};
