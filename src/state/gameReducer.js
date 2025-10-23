const MAX_HISTORY = 40;

const createBases = () => ({ first: false, second: false, third: false });
const createScoreRow = () => Array.from({ length: 9 }, () => 0);
const createScoreboard = () => ({ home: createScoreRow(), away: createScoreRow() });

export const initialState = {
  gameStarted: false,
  players: {
    shooter: '',
    offDrinker: '',
    catcher: '',
    defDrinker: ''
  },
  inning: 1,
  half: 'Top',
  strikes: 0,
  outs: 0,
  bases: createBases(),
  score: { home: 0, away: 0 },
  hits: { home: 0, away: 0 },
  scoreboard: createScoreboard(),
  history: [],
  lastSuccessfulAction: null
};

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const players = action.payload?.players ?? initialState.players;
      return {
        ...initialState,
        gameStarted: true,
        players,
        bases: createBases(),
        scoreboard: createScoreboard(),
        score: { home: 0, away: 0 },
        hits: { home: 0, away: 0 },
        history: []
      };
    }
    case 'OFFENSE_HIT': {
      if (!state.gameStarted) return state;
      const steps = action.payload?.bases ?? 1;
      const nextState = handleHit(state, steps);
      return pushHistory(state, nextState);
    }
    case 'STEAL': {
      if (!state.gameStarted) return state;
      const nextState = handleSteal(state);
      if (nextState === state) return state;
      return pushHistory(state, nextState);
    }
    case 'BUNT': {
      if (!state.gameStarted) return state;
      const nextState = handleBunt(state);
      return pushHistory(state, nextState);
    }
    case 'STRIKE': {
      if (!state.gameStarted) return state;
      const nextState = handleStrike(state);
      return pushHistory(state, nextState);
    }
    case 'BONUS': {
      if (!state.gameStarted) return state;
      const nextState = handleBonus(state);
      if (nextState === state) return state;
      return pushHistory(state, nextState);
    }
    case 'CATCH': {
      if (!state.gameStarted) return state;
      const nextState = handleCatch(state);
      return pushHistory(state, nextState);
    }
    case 'DEF_FLIP': {
      if (!state.gameStarted) return state;
      const nextState = handleDefFlip(state);
      return pushHistory(state, nextState);
    }
    case 'DEF_BUNT': {
      if (!state.gameStarted) return state;
      const nextState = handleDefBunt(state);
      return pushHistory(state, nextState);
    }
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        ...previous,
        history: state.history.slice(0, -1)
      };
    }
    default:
      return state;
  }
}

function handleHit(state, steps) {
  const { bases, runs } = advanceBases(state.bases, steps, true);
  const { scoreboard, score } = applyRuns(state, runs);
  const offense = getOffenseKey(state.half);
  const hits = {
    ...state.hits,
    [offense]: state.hits[offense] + 1
  };

  return maybeAdvanceHalf({
    ...state,
    bases,
    score,
    scoreboard,
    hits,
    strikes: 0,
    lastSuccessfulAction: null
  });
}

function handleSteal(state) {
  const { bases, runs, success } = stealRunner(state.bases);
  if (!success) {
    return state;
  }
  let scoreboard = state.scoreboard;
  let score = state.score;
  if (runs > 0) {
    ({ scoreboard, score } = applyRuns(state, runs));
  }

  return maybeAdvanceHalf({
    ...state,
    bases,
    score,
    scoreboard,
    strikes: 0,
    lastSuccessfulAction: 'STEAL'
  });
}

function handleBunt(state) {
  const { bases, runs } = advanceBases(state.bases, 1, true);
  let scoreboard = state.scoreboard;
  let score = state.score;
  if (runs > 0) {
    ({ scoreboard, score } = applyRuns(state, runs));
  }

  return maybeAdvanceHalf({
    ...state,
    bases,
    score,
    scoreboard,
    strikes: 0,
    lastSuccessfulAction: 'BUNT'
  });
}

function handleStrike(state) {
  const strikes = state.strikes + 1;
  if (strikes >= 3) {
    const outs = state.outs + 1;
    return maybeAdvanceHalf({
      ...state,
      outs,
      strikes: 0,
      lastSuccessfulAction: null
    });
  }
  return {
    ...state,
    strikes,
    lastSuccessfulAction: null
  };
}

function handleBonus(state) {
  if (state.lastSuccessfulAction !== 'STEAL' && state.lastSuccessfulAction !== 'BUNT') {
    return state;
  }
  const { scoreboard, score } = applyRuns(state, 1);
  return maybeAdvanceHalf({
    ...state,
    score,
    scoreboard,
    strikes: 0,
    lastSuccessfulAction: null
  });
}

function handleCatch(state) {
  const outs = state.outs + 1;
  return maybeAdvanceHalf({
    ...state,
    outs,
    strikes: 0,
    lastSuccessfulAction: null
  });
}

function handleDefFlip(state) {
  const outs = state.outs + 1;
  const bases = removeLeadRunner(state.bases);
  return maybeAdvanceHalf({
    ...state,
    outs,
    bases,
    strikes: 0,
    lastSuccessfulAction: null
  });
}

function handleDefBunt(state) {
  const outs = state.outs + 1;
  const bases = {
    ...state.bases,
    first: false
  };

  return maybeAdvanceHalf({
    ...state,
    outs,
    bases,
    strikes: 0,
    lastSuccessfulAction: null
  });
}

function advanceBases(bases, steps, includeBatter) {
  const runners = [];
  if (bases.first) runners.push(1);
  if (bases.second) runners.push(2);
  if (bases.third) runners.push(3);
  if (includeBatter) runners.push(0);

  const occupied = [];
  let runs = 0;
  runners.forEach((start) => {
    const destination = start + steps;
    if (destination > 3) {
      runs += 1;
    } else {
      occupied.push(destination);
    }
  });

  const nextBases = createBases();
  occupied.forEach((position) => {
    if (position === 1) nextBases.first = true;
    if (position === 2) nextBases.second = true;
    if (position === 3) nextBases.third = true;
  });

  return { bases: nextBases, runs };
}

function stealRunner(bases) {
  const nextBases = createBases();
  let runs = 0;
  let success = false;

  if (bases.third) {
    runs += 1;
    success = true;
  }
  if (bases.second) {
    nextBases.third = true;
    success = true;
  }
  if (bases.first) {
    nextBases.second = true;
    success = true;
  }

  return { bases: nextBases, runs, success };
}

function removeLeadRunner(bases) {
  if (bases.third) {
    return { ...bases, third: false };
  }
  if (bases.second) {
    return { ...bases, second: false };
  }
  if (bases.first) {
    return { ...bases, first: false };
  }
  return bases;
}

function applyRuns(state, runs) {
  if (!runs) {
    return { scoreboard: state.scoreboard, score: state.score };
  }
  const team = getOffenseKey(state.half);
  const inningIndex = Math.min(state.inning, 9) - 1;

  const newScoreboard = {
    home: [...state.scoreboard.home],
    away: [...state.scoreboard.away]
  };
  newScoreboard[team][inningIndex] += runs;

  const newScore = {
    ...state.score,
    [team]: state.score[team] + runs
  };

  return { scoreboard: newScoreboard, score: newScore };
}

function maybeAdvanceHalf(state) {
  if (state.outs < 3) {
    return state;
  }
  const wasBottom = state.half === 'Bottom';
  const nextHalf = wasBottom ? 'Top' : 'Bottom';
  const nextInning = wasBottom ? state.inning + 1 : state.inning;

  return {
    ...state,
    inning: nextInning,
    half: nextHalf,
    outs: 0,
    strikes: 0,
    bases: createBases(),
    lastSuccessfulAction: null
  };
}

function getOffenseKey(half) {
  return half === 'Top' ? 'away' : 'home';
}

function snapshotState(state) {
  const { history, ...rest } = state;
  return JSON.parse(JSON.stringify(rest));
}

function pushHistory(state, next) {
  if (next === state) {
    return state;
  }
  const snapshot = snapshotState(state);
  const history = [...state.history, snapshot];
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
  return {
    ...next,
    history
  };
}
