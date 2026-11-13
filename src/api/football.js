const cache = new Map();

export async function getSeason(code, season) {
  const url = `https://raw.githubusercontent.com/openfootball/football.json/master/${season}/${code}.json`;
  if (cache.has(url)) return cache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Не удалось загрузить сезон (${response.status}).`);
  const data = await response.json();
  if (!Array.isArray(data.matches)) throw new Error('Файл сезона имеет неизвестный формат.');
  cache.set(url, data);
  return data;
}
