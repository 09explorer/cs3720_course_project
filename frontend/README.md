# GENERIC NAME - VEX Autonomous Route Planner (UI base)

Expo SDK 58, JavaScript, React Native, Expo Router. UI placeholders only,
ready to be wired to a FastAPI backend.

## Setup
```bash
npm install
# Let Expo pick the SDK 58-compatible versions of everything:
npx expo install react react-dom react-native expo-router react-native-safe-area-context \
  react-native-screens react-native-svg expo-linking expo-constants expo-status-bar @expo/vector-icons
cp .env.example .env
npx expo start
```
SDK 58 Expo Go only supports SDK 58. If the store version isn't available on your
device yet, use a development build (`npx expo run:android` / `run:ios`).

## Structure
- `app/`         Expo Router route files (one line each, re-export a screen)
- `screens/`     Home, Planner (editor), Import (data list), Feedback (form), Settings
- `components/`  AppButton, TopNavBar, FieldCanvas, PointTabs, PointEditor, RouteCard, FormField, StatusMessage ...
- `services/api.js`  ALL network calls (the only file that touches the backend)
- `hooks/`, `utils/`, `constants/`, `assets/` (images + `data/routes.json` sample data)

## Wiring to the backend
1. Set `EXPO_PUBLIC_USE_MOCK_DATA=false` and `EXPO_PUBLIC_API_URL` in `.env`.
2. Start your FastAPI server with `--host 0.0.0.0` so devices on your network can reach it.
3. Settings screen -> "Test connection".
4. Search for `WIRING POINT` in `screens/PlannerScreen.js` for where route processing plugs in.
5. `components/FieldCanvas.js` is a blank placeholder; draw the planning grid there.

Endpoints: `GET /health`, `GET /routes?q=&sort=`, `GET /routes/{id}`, `POST /routes`, `POST /feedback`.
Route shape: `{ id, name, team, updatedAt, thumbnailUrl, points: [{ id, label, x, y, h }] }`
(inches from field center, +Y up; H in degrees, 0 = up, clockwise).