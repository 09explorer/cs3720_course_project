import AsyncStorage from '@react-native-async-storage/async-storage';

// All saved paths live in one AsyncStorage entry: an array of
//   {
//     "Path Name":   string,
//     "Team number": string,
//     "Last Edit":   Date   (stored as an ISO string, revived to a Date on read),
//     "Points":      [{ id, label, x, y, h }]
//   }
const STORAGE_KEY = 'paths';

// Returns every saved path, or [] if there are none (or the data is unreadable).
export async function getPaths() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({ ...p, 'Last Edit': new Date(p['Last Edit']) }));
  } catch {
    return [];
  }
}

// True if a path with this name (ignoring surrounding spaces) is already saved.
export async function pathExists(name) {
  const paths = await getPaths();
  const wanted = name.trim();
  return paths.some((p) => p['Path Name'] === wanted);
}

// Saves a path. A path with the same name is replaced in place; otherwise the
// new path is appended. Callers should check pathExists first to ask before
// overwriting.
export async function savePath({ name, team = '', points = [] }) {
  const record = {
    'Path Name': name.trim(),
    'Team number': team.trim(),
    'Last Edit': new Date(),
    Points: points.map(({ id, label, x, y, h }) => ({ id, label, x, y, h })),
  };

  const paths = await getPaths();
  const index = paths.findIndex((p) => p['Path Name'] === record['Path Name']);
  if (index >= 0) paths[index] = record;
  else paths.push(record);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
  return record;
}

// Returns the saved path with this exact name, or undefined if there isn't one.
export async function getPathByName(name) {
  const paths = await getPaths();
  return paths.find((p) => p['Path Name'] === name);
}

// Removes the saved path with this name. Does nothing if it doesn't exist.
export async function deletePath(name) {
  const paths = await getPaths();
  const remaining = paths.filter((p) => p['Path Name'] !== name);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}