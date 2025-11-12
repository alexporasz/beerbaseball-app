import './diamond.css';

export default function WireDiamond({ bases, label, className, score }) {
  const classes = ['wire-diamond', className].filter(Boolean).join(' ');
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
            <span className="score-away" aria-label="Away score">
              {score.away}
            </span>
            <span aria-hidden="true" className="score-separator">
              –
            </span>
            <span className="score-home" aria-label="Home score">
              {score.home}
            </span>
          </span>
        </p>
      ) : null}
    </div>
  );
}
