export default function H2HMidItem({ total, noResult }) {
  return (
    <div className="h2h-middle">
      <div className="h2h-detail">
        <small>Played</small>
        <h1>{total ?? 0}</h1>
        {noResult > 0 && (
          <small>
            No result :<strong> {noResult}</strong>
          </small>
        )}
      </div>
    </div>
  );
}
