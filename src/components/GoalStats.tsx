import { Player } from "../input/players";

import "./GoalStats.scss";

interface StatProps {
  stat: number;
  team: Player[];
  statName: string;
}

const RateStat = ({ stat, team, statName }: StatProps) => {
  const att_stat = statName === "fgm" ? "fga" : "fta";
  const team_makes = team.map((p) => p[statName]).reduce((a, b) => a + b, 0);
  const team_attempts = team.map((p) => p[att_stat]).reduce((a, b) => a + b, 0);

  return (
    <div className="aiming_stat">
      <span>
        <b>{statName === "fgm" ? "FG%" : "FT%"}</b>
      </span>
      <span>
        {(team_makes / team_attempts).toFixed(2)}/{stat.toFixed(4)}
      </span>
    </div>
  );
};

const Stat = ({ stat, team, statName }: StatProps) => {
  const teamStat = team.map((p) => p[statName]).reduce((a, b) => a + b, 0);
  const st =
    stat > teamStat ? (
      <span>
        {(stat - teamStat).toFixed(2)} left (
        {((100 * teamStat) / stat).toFixed(2)}%)
      </span>
    ) : (
      <span>
        {teamStat}/{stat}
      </span>
    );

  return (
    <div className="aiming_stat">
      <span>
        <b>{statName}</b>
      </span>
      {st}
    </div>
  );
};

interface GoalStatsProps {
  stats: Record<string, number>;
  team: Player[];
}

export const GoalStats = ({ stats, team }: GoalStatsProps) => {
  return (
    <div className="goal_stats">
      <Stat stat={stats["pts"]} team={team} statName={"points"} />
      <Stat stat={stats["ast"]} team={team} statName={"ast"} />
      <Stat stat={stats["reb"]} team={team} statName={"reb"} />
      <Stat stat={stats["stl"]} team={team} statName={"stl"} />
      <Stat stat={stats["blk"]} team={team} statName={"blk"} />
      <Stat stat={stats["tpm"]} team={team} statName={"tpm"} />
      <Stat stat={stats["fgm"]} team={team} statName={"fgm"} />
      <RateStat stat={stats["fgp"]} team={team} statName={"fgm"} />
      <Stat stat={stats["ftm"]} team={team} statName={"ftm"} />
      <RateStat stat={stats["ftp"]} team={team} statName={"ftm"} />
      <Stat stat={stats["to"]} team={team} statName={"to"} />
    </div>
  );
};
