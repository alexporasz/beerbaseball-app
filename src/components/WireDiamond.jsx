import './diamond.css';

export default function WireDiamond({ bases, label, className }) {
  const classes = ['wire-diamond', className].filter(Boolean).join(' ');
  return (
    <div className={classes} aria-label={label ?? 'Base runners'}>
      <div className={`base base-1 ${bases.first ? 'occupied' : ''}`} aria-label="First base">
        <span>1B</span>
      </div>
      <div className={`base base-2 ${bases.second ? 'occupied' : ''}`} aria-label="Second base">
        <span>2B</span>
      </div>
      <div className={`base base-3 ${bases.third ? 'occupied' : ''}`} aria-label="Third base">
        <span>3B</span>
      </div>
    </div>
  );
}
