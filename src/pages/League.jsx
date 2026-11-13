import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buildTable, tableAfterRound } from '../lib/football.js';
import { getSeason } from '../api/football.js';
import mini from '../lib/fixtures/mini.json';
import StandingsTable from '../components/StandingsTable.jsx';

const labels = { 'en.1': ['ПРЕМЬЕР-ЛИГА', 'Англия', '🇬🇧'], 'es.1': ['ЛА ЛИГА', 'Испания', '🇪🇸'], 'de.1': ['БУНДЕСЛИГА', 'Германия', '🇩🇪'], 'it.1': ['СЕРИЯ А', 'Италия', '🇮🇹'], 'fr.1': ['ЛИГА 1', 'Франция', '🇫🇷'] };
export default function League() {
  const { code = 'en.1', season = '2024-25' } = useParams();
  const [matches, setMatches] = useState([]); const [status, setStatus] = useState('loading'); const [round, setRound] = useState(38);
  useEffect(() => { let active = true; setStatus('loading'); getSeason(code, season).then((data) => { if (active) { setMatches(data.matches); setStatus('ready'); } }).catch(() => { if (active && code === 'en.1' && season === '2024-25') { setMatches(mini.matches); setStatus('demo'); } else if (active) setStatus('error'); }); return () => { active = false; }; }, [code, season]);
  const maxRound = useMemo(() => Math.max(1, ...matches.map((m) => Number(String(m.round || '').match(/\d+/)?.[0] || 0))), [matches]);
  useEffect(() => setRound(maxRound), [maxRound]);
  const rows = useMemo(() => round >= maxRound ? buildTable(matches) : tableAfterRound(matches, round), [matches, round, maxRound]);
  const meta = labels[code];
  if (!meta) return <div className="error-state"><h1>Лига не найдена</h1><Link to="/">Вернуться к лигам ↗</Link></div>;
  return <><div className="breadcrumb"><Link to="/">Лиги</Link><span>/</span><span>{meta[0]}</span></div><section className="league-intro"><div><div className="eyebrow"><span className="eyebrow-line"/> {meta[1].toUpperCase()} · {season.replace('-', ' / ')}</div><h1>{meta[0].split(' ').map((word, i) => i === 1 ? <em key={word}> {word}</em> : ` ${word}`)}</h1><p>Таблица чемпионата · {meta[2]} {meta[1]}</p></div><div className="league-total"><b>{rows.length ? matches.length : '—'}</b><span>МАТЧЕЙ В СЕЗОНЕ</span></div></section>{status === 'loading' ? <div className="notice">Загружаем матчи сезона…</div> : status === 'error' ? <div className="notice error">Не удалось загрузить сезон. Проверьте код лиги и подключение.</div> : <><div className="table-toolbar"><div><span className="toolbar-title">ТУРНИРНАЯ ТАБЛИЦА</span><span className="toolbar-sub">{status === 'demo' ? 'демо-данные · часть сезона' : 'обновлено по результатам матчей'}</span></div><label className="round-picker">ПОСЛЕ ТУРА <input aria-label="Номер тура" type="range" min="1" max={maxRound} value={round} onChange={(event) => setRound(Number(event.target.value))}/><b>{round}</b></label></div><div className="table-legend"><span><i className="legend-champions"/> Лига чемпионов</span><span><i className="legend-relegation"/> Зона вылета</span></div><StandingsTable rows={rows} code={code} season={season}/>{status === 'demo' && <p className="demo-note">Openfootball сейчас недоступен. Показан небольшой демонстрационный набор матчей.</p>}</>}</>;
}
