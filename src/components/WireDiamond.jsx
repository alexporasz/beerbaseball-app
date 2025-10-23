import './diamond.css';

export default function WireDiamond({ bases, label, className }) {
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
    </div>
  );
}
