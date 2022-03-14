import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchResults } from "../api";
import {
  Loader,
  MatchPredictions,
  MatchStats,
  PageLinkBar,
  ResultBanner,
  WinProbability,
} from "../components";
import { getMatch } from "../helpers";
import { useAPIData } from "../hooks";

export function Match({ statsPage }) {
  const { slug } = useParams();
  const { isLoading, data: matches } = useAPIData(fetchResults);

  if (isLoading) return <Loader />;

  const match = getMatch(matches, slug);

  if (!match) return null;

  return (
    <Container className="match-detail" fluid>
      <ResultBanner match={match} statsPage={statsPage} />
      {match.status === "scheduled" && <WinProbability match={match} />}
      <PageLinkBar slug={slug} />
      {statsPage && <MatchStats match={match} />}
      {!statsPage && <MatchPredictions match={match} />}
    </Container>
  );
}
