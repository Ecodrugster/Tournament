import { createContext, useContext, useEffect, useReducer } from 'react';

const STORAGE_KEY = 'touchline:user-data';
function load() {
  try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return { favorites: Array.isArray(data.favorites) ? data.favorites : [], predictions: data.predictions && typeof data.predictions === 'object' ? data.predictions : {} }; }
  catch { return { favorites: [], predictions: {} }; }
}
function reducer(state, action) {
  switch (action.type) {
    case 'toggleFavorite': return { ...state, favorites: state.favorites.includes(action.team) ? state.favorites.filter((team) => team !== action.team) : [...state.favorites, action.team] };
    case 'setPrediction': return { ...state, predictions: { ...state.predictions, [action.key]: action.score } };
    case 'removePrediction': { const predictions = { ...state.predictions }; delete predictions[action.key]; return { ...state, predictions }; }
    default: return state;
  }
}
const UserDataContext = createContext(null);

export function UserDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage may be unavailable */ } }, [state]);
  return <UserDataContext.Provider value={{ state, dispatch }}>{children}</UserDataContext.Provider>;
}
export function useUserData() { return useContext(UserDataContext); }
