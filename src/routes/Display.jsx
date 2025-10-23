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
                {innings.map((inningNumber, index) => (
                  <td key={inningNumber}>{scoreboard.away[index]}</td>
                ))}
                <td>{awayTotal}</td>
                <td>{hits.away}</td>
              </tr>
              <tr>
                <th scope="row">Home</th>
                {innings.map((inningNumber, index) => (
                  <td key={inningNumber}>{scoreboard.home[index]}</td>
                ))}
                <td>{homeTotal}</td>
                <td>{hits.home}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel status-panel" aria-label="Game status">
        <header className="panel-title">Game Status</header>
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

      <section className="panel diamond-panel" aria-label="Bases">
        <header className="panel-title">Bases</header>
        <WireDiamond bases={bases} />
      </section>
    </div>
  );
}
