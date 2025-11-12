import WireDiamond from '../components/WireDiamond.jsx';
import { useGame } from '../state/GameContext.jsx';
import '../styles/display.css';

const innings = Array.from({ length: 9 }, (_, index) => index + 1);

export default function Display() {
  const {
    state: { inning, half, strikes, outs, scoreboard, hits, bases }
  } = useGame();

  const awayTotal = scoreboard.away.reduce((total, value) => total + value, 0);
  const homeTotal = scoreboard.home.reduce((total, value) => total + value, 0);

  const parsedInning = Number(inning);
  const normalizedInning = Number.isFinite(parsedInning) ? parsedInning : 1;
  const boundedInning = Math.min(Math.max(normalizedInning, 1), 9);
  const currentInningIndex = boundedInning - 1;

  const getInningCellState = (team, index) => {
    const value = scoreboard?.[team]?.[index] ?? 0;
    const inningNumber = index + 1;

    if (index < currentInningIndex) {
      return { display: value, isInProgress: false };
    }

    if (index > currentInningIndex) {
      return { display: '-', isInProgress: false };
    }

    if (half === 'Top') {
      if (team === 'away') {
        return { display: value, isInProgress: true };
      }
      if (normalizedInning === inningNumber) {
        return { display: '-', isInProgress: false };
      }
      return { display: value, isInProgress: false };
    }

    if (team === 'home') {
      return { display: value, isInProgress: true };
    }

    return { display: value, isInProgress: false };
  };

  return (
    <div className="display-grid">
      <section className="panel scoreboard-panel">
        <header className="panel-title">Scoreboard</header>
        <div className="table-wrap" role="region" aria-label="Score by inning">
          <table className="scoreboard-table">
            <thead>
              <tr>
                <th scope="col">Team</th>
                {innings.map((inningNumber) => (
                  <th key={inningNumber} scope="col">
                    {inningNumber}
                  </th>
                ))}
                <th scope="col">Total</th>
                <th scope="col">H</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Away</th>
                {innings.map((inningNumber, index) => {
                  const { display, isInProgress } = getInningCellState('away', index);
                  return (
                    <td
                      key={inningNumber}
                      className={`inning-score${isInProgress ? ' in-progress' : ''}`}
                    >
                      {display}
                    </td>
                  );
                })}
                <td className="total-score">{awayTotal}</td>
                <td>{hits.away}</td>
              </tr>
              <tr>
                <th scope="row">Home</th>
                {innings.map((inningNumber, index) => {
                  const { display, isInProgress } = getInningCellState('home', index);
                  return (
                    <td
                      key={inningNumber}
                      className={`inning-score${isInProgress ? ' in-progress' : ''}`}
                    >
                      {display}
                    </td>
                  );
                })}
                <td className="total-score">{homeTotal}</td>
                <td>{hits.home}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel status-panel" aria-label="Bases and game status">
        <div className="diamond-layout">
          <p className="score-display" aria-live="polite">
            <span className="score-label">Score</span>
            <span className="score-values">
              <span className="score-away" aria-label="Away score">
                {awayTotal}
              </span>
              <span aria-hidden="true" className="score-separator">
                –
              </span>
              <span className="score-home" aria-label="Home score">
                {homeTotal}
              </span>
            </span>
          </p>
          <WireDiamond bases={bases} />
        </div>
        <dl className="status-grid">
          <div>
            <dt>Inning</dt>
            <dd>{inning}</dd>
          </div>
          <div>
            <dt>Half</dt>
            <dd>{half}</dd>
          </div>
          <div>
            <dt>Strikes</dt>
            <dd>{strikes}</dd>
          </div>
          <div>
            <dt>Outs</dt>
            <dd>{outs}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
