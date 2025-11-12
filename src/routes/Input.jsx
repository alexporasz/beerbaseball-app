import { useEffect, useRef, useState } from 'react';
import WireDiamond from '../components/WireDiamond.jsx';
import { useGame } from '../state/GameContext.jsx';
import '../styles/input.css';

const ADD_NEW_OPTION = '__add_new__';

const fields = [
  { key: 'shooter', label: 'Shooter' },
  { key: 'offDrinker', label: 'Off Drinker' },
  { key: 'catcher', label: 'Catcher' },
  { key: 'defDrinker', label: 'Def Drinker' }
];

export default function Input() {
  const { state, dispatch } = useGame();
  const { gameStarted, players, bases, score, strikes, outs, half, lastSuccessfulAction } = state;
  const [formState, setFormState] = useState(players);
  const [availablePlayers, setAvailablePlayers] = useState(() => {
    const initialRoster = new Set(Object.values(players).filter(Boolean));
    return Array.from(initialRoster);
  });
  const [addingKey, setAddingKey] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const newPlayerInputRef = useRef(null);

  useEffect(() => {
    if (addingKey && newPlayerInputRef.current) {
      newPlayerInputRef.current.focus();
    }
  }, [addingKey]);

  useEffect(() => {
    setFormState(players);
    setAvailablePlayers((current) => {
      const roster = new Set(current);
      Object.values(players)
        .filter(Boolean)
        .forEach((name) => roster.add(name));
      return Array.from(roster);
    });
  }, [players]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value === ADD_NEW_OPTION) {
      setAddingKey(name);
      setNewPlayerName('');
      return;
    }
    setAddingKey((current) => (current === name ? null : current));
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleNewPlayerChange = (event) => {
    setNewPlayerName(event.target.value);
  };

  const confirmAddPlayer = () => {
    if (!addingKey) return;
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) {
      return;
    }

    const existingName = availablePlayers.find(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );
    const finalName = existingName ?? trimmedName;

    if (!existingName) {
      setAvailablePlayers((current) => [...current, finalName]);
    }

    setFormState((current) => ({ ...current, [addingKey]: finalName }));
    setAddingKey(null);
    setNewPlayerName('');
  };

  const handleNewPlayerKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      confirmAddPlayer();
    }
  };

  const handleCancelAddPlayer = () => {
    setAddingKey(null);
    setNewPlayerName('');
  };

  const handleStart = (event) => {
    event.preventDefault();
    dispatch({ type: 'START_GAME', payload: { players: formState } });
  };

  const triggerHit = (basesToAdvance) => dispatch({ type: 'OFFENSE_HIT', payload: { bases: basesToAdvance } });
  const triggerSteal = () => dispatch({ type: 'STEAL' });
  const triggerBunt = () => dispatch({ type: 'BUNT' });
  const triggerBonus = () => dispatch({ type: 'BONUS' });
  const triggerStrike = () => dispatch({ type: 'STRIKE' });
  const triggerCatch = () => dispatch({ type: 'CATCH' });
  const triggerFlip = () => dispatch({ type: 'DEF_FLIP' });
  const triggerDefBunt = () => dispatch({ type: 'DEF_BUNT' });
  const triggerUndo = () => dispatch({ type: 'UNDO' });

  const bonusEnabled = lastSuccessfulAction === 'STEAL' || lastSuccessfulAction === 'BUNT';

  if (!gameStarted) {
    return (
      <div className="setup-panel">
        <form className="setup-form" onSubmit={handleStart}>
          <h1 className="panel-title">Pre-game Setup</h1>
          <div className="fields-grid">
            {fields.map(({ key, label }) => (
              <label key={key} className="field">
                <span>{label}</span>
                <select
                  name={key}
                  value={addingKey === key ? ADD_NEW_OPTION : formState[key] ?? ''}
                  onChange={handleChange}
                >
                  <option value="">Select player</option>
                  {(() => {
                    const selectedValue = formState[key] ?? '';
                    const options = availablePlayers.includes(selectedValue) || !selectedValue
                      ? availablePlayers
                      : [...availablePlayers, selectedValue];
                    return options.map((nameOption) => (
                      <option key={nameOption} value={nameOption}>
                        {nameOption}
                      </option>
                    ));
                  })()}
                  <option value={ADD_NEW_OPTION}>Add a player…</option>
                </select>
                {addingKey === key && (
                  <div className="add-player">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={handleNewPlayerChange}
                      onKeyDown={handleNewPlayerKeyDown}
                      placeholder="Enter new player name"
                      ref={newPlayerInputRef}
                    />
                    <div className="add-player-controls">
                      <button type="button" className="inline-btn" onClick={confirmAddPlayer}>
                        Save
                      </button>
                      <button
                        type="button"
                        className="inline-btn secondary-btn"
                        onClick={handleCancelAddPlayer}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </label>
            ))}
          </div>
          <button className="primary-btn" type="submit">
            Start Game
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="controls-grid">
      <section className="control-group" aria-label="Offense controls">
        <header className="panel-title">Offense</header>
        <div className="button-grid">
          <button type="button" className="action-btn" onClick={() => triggerHit(1)}>
            1st
          </button>
          <button type="button" className="action-btn" onClick={() => triggerHit(2)}>
            2nd
          </button>
          <button type="button" className="action-btn" onClick={() => triggerHit(3)}>
            3rd
          </button>
          <button type="button" className="action-btn" onClick={() => triggerHit(4)}>
            Homer
          </button>
          <button type="button" className="action-btn" onClick={triggerSteal}>
            Steal
          </button>
          <button type="button" className="action-btn" onClick={triggerBunt}>
            Bunt
          </button>
          <button type="button" className="action-btn" onClick={triggerBonus} disabled={!bonusEnabled}>
            Bonus
          </button>
          <button type="button" className="action-btn" onClick={triggerStrike}>
            Strike
          </button>
        </div>
      </section>

      <section className="control-group" aria-label="Defense controls">
        <header className="panel-title">Defense</header>
        <div className="button-grid">
          <button type="button" className="action-btn" onClick={triggerCatch}>
            Catch
          </button>
          <button type="button" className="action-btn" onClick={triggerFlip}>
            Def Flip
          </button>
          <button type="button" className="action-btn" onClick={triggerDefBunt}>
            Def Bunt
          </button>
          <button type="button" className="action-btn" onClick={triggerUndo}>
            Undo
          </button>
        </div>
      </section>

      <section className="preview-panel" aria-label="Game preview">
        <header className="panel-title">Preview</header>
        <WireDiamond bases={bases} className="compact-diamond" />
        <div className="score-summary">
          <div className="score-row">
            <span>Away</span>
            <span>{score.away}</span>
          </div>
          <div className="score-row">
            <span>Home</span>
            <span>{score.home}</span>
          </div>
        </div>
        <dl className="status-inline">
          <div>
            <dt>Strikes</dt>
            <dd>{strikes}</dd>
          </div>
          <div>
            <dt>Outs</dt>
            <dd>{outs}</dd>
          </div>
          <div>
            <dt>Half</dt>
            <dd>{half}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
