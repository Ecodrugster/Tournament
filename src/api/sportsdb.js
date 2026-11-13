const API_KEY = '123';
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const DAY = 24 * 60 * 60 * 1000;

export function isFresh(savedAt, ttl = DAY, now = Date.now()) {
  return Number.isFinite(savedAt) && now - savedAt < ttl && now >= savedAt;
}

function readCache(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value && isFresh(value.savedAt) ? value.data : null;
  } catch { return null; }
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data })); } catch { /* storage may be full or disabled */ }
}

async function cachedFetch(kind, id, endpoint, property) {
  const key = `touchline:sportsdb:${kind}:${id}`;
  const cached = readCache(key);
  if (cached) return { data: cached, cached: true, rateLimited: false };
  try {
    const response = await fetch(`${BASE}/${endpoint}?id=${encodeURIComponent(id)}`);
    if (response.status === 429) return { data: null, cached: false, rateLimited: true };
    if (!response.ok) throw new Error(`TheSportsDB: ${response.status}`);
    const payload = await response.json();
    const data = payload[property] || null;
    if (data) writeCache(key, data);
    return { data, cached: false, rateLimited: false };
  } catch (error) {
    return { data: null, cached: false, rateLimited: false, error };
  }
}

export const getTeamInfo = (id) => cachedFetch('team', id, 'lookupteam.php', 'teams');
export const getPlayers = (id) => cachedFetch('players', id, 'lookup_all_players.php', 'player');
