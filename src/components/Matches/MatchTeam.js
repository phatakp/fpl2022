export function MatchTeam({ team }) {
  return (
    <>
      <span className="long">{team.long_name}</span>
      <span className="short">{team.short_name}</span>
    </>
  );
}
