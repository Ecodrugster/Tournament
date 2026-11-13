import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="error-state"><span>404</span><h1>Похоже, мяч ушёл за поле.</h1><p>Такой страницы нет. Вернёмся к игре?</p><Link to="/">На главную ↗</Link></div>; }
