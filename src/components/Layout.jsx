import { NavLink, Outlet } from 'react-router-dom';
import { useUserData } from '../state/UserData.jsx';

export default function Layout() {
  const { state } = useUserData();
  return <div className="app-shell"><header className="topbar"><NavLink className="brand" to="/"><span className="brand-mark">T</span><span>TOUCHLINE<span className="brand-period">.</span></span></NavLink><nav className="main-nav"><NavLink to="/">Лиги</NavLink><NavLink to="/favorites">Избранное <span className="nav-count">{state.favorites.length || ''}</span></NavLink><NavLink to="/predictions">Мои прогнозы</NavLink></nav><span className="live-label"><i/> СЕЗОН 24/25</span></header><main className="page"><Outlet/></main><footer>Данные матчей — openfootball <span>•</span> TOUCHLINE 2025</footer></div>;
}
