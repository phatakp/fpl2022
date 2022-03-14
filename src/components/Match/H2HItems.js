import H2HItem from "./H2HItem";

export default function H2HItems({ klass, teamStats }) {
  if (!teamStats) return null;
  const {
    all_winpct,
    all_wins,
    home_winpct,
    home_wins,
    away_winpct,
    away_wins,
  } = teamStats;

  const h2hItems = [
    { title: "Total Wins", value: all_wins, width: all_winpct },
    { title: "Home", value: home_wins, width: home_winpct },
    { title: "Away", value: away_wins, width: away_winpct },
  ];

  return (
    <div className={`h2h-detail ${klass}`}>
      {h2hItems.map((item) => (
        <H2HItem
          key={item.title}
          dir={klass === "teamL" ? "left" : "right"}
          barWidth={`${item.width ?? 0}%`}
          value={item.value}
          title={item.title}
        />
      ))}
    </div>
  );
}
