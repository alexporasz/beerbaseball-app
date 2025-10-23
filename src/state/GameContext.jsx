import { createContext, useContext, useReducer } from 'react';
import { gameReducer, initialState } from './gameReducer.js';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
