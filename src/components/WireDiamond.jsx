import './diamond.css';

const TEAM_LABELS = {
  away: 'Away',
  home: 'Home'
};

export default function WireDiamond({ bases, label, className, score, half }) {
  const classes = ['wire-diamond', className].filter(Boolean).join(' ');
  const battingOrder = half === 'Bottom' ? ['home', 'away'] : ['away', 'home'];

  const orderedScores = score
    ? battingOrder.map((team) => ({
        team,
        label: TEAM_LABELS[team],
        value: score[team] ?? 0
      }))
    : [];

  return (
    <div className={classes} aria-label={label ?? 'Base runners'}>
      <div className={`base base-1 ${bases.first ? 'occupied' : ''}`} aria-label="1st base">
        <span>1st</span>
      </div>
      <div className={`base base-2 ${bases.second ? 'occupied' : ''}`} aria-label="2nd base">
        <span>2nd</span>
      </div>
      <div className={`base base-3 ${bases.third ? 'occupied' : ''}`} aria-label="3rd base">
        <span>3rd</span>
      </div>
      {score ? (
        <p className="score-display" aria-live="polite">
          <span className="score-label">Score</span>
          <span className="score-values">
            {orderedScores.map(({ team, label: teamLabel, value }) => (
              <span key={team} className={`score-line score-${team}`} aria-label={`${teamLabel} score`}>
                <span className="score-team" aria-hidden="true">
                  {teamLabel}
                </span>
                <span className="score-value">{value}</span>
              </span>
            ))}
          </span>
        </p>
      ) : null}
    </div>
  );
}
