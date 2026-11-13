import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import League from './pages/League.jsx';
import Team from './pages/Team.jsx';
import Favorites from './pages/Favorites.jsx';
import Predictions from './pages/Predictions.jsx';
import NotFound from './pages/NotFound.jsx';
import { UserDataProvider } from './state/UserData.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><UserDataProvider><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="league/:code/:season" element={<League/>}/><Route path="league/:code/:season/team/:team" element={<Team/>}/><Route path="favorites" element={<Favorites/>}/><Route path="predictions" element={<Predictions/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></UserDataProvider></BrowserRouter></React.StrictMode>);
