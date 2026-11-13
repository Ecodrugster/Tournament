import { Link } from 'react-router-dom';
import { useUserData } from '../state/UserData.jsx';
export default function Favorites() {
  const { state, dispatch } = useUserData();
  return <><div className="breadcrumb"><Link to="/">Лиги</Link><span>/</span><span>Избранное</span></div><section className="page-title"><div className="eyebrow"><span className="eyebrow-line"/> ВАША КОЛЛЕКЦИЯ</div><h1>Близкие <em>по духу.</em></h1><p>Клубы, за которыми вы следите.</p></section>{state.favorites.length ? <div className="favorites-grid">{state.favorites.map((team) => <article className="favorite-card" key={team}><span>КЛУБ · ПРЕМЬЕР-ЛИГА</span><h2>{team.replace(/ FC$| AFC$/, '')}</h2><div><Link to={`/league/en.1/2024-25/team/${encodeURIComponent(team)}`}>Открыть профиль ↗</Link><button aria-label={`Удалить ${team} из избранного`} onClick={() => dispatch({ type: 'toggleFavorite', team })}>×</button></div></article>)}</div> : <div className="empty-state"><span>☆</span><h2>Пока тихо.</h2><p>Добавьте клуб в избранное со страницы команды.</p><Link to="/league/en.1/2024-25">Открыть таблицу ↗</Link></div>}</>;
}
