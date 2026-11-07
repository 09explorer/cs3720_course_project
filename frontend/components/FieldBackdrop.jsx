import { StyleSheet } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { colors } from '../constants/theme';

// Decorative Home-screen background: faint field tiles with a dashed
// A -> B -> C route. Purely visual; ignores touches.
export default function FieldBackdrop() {
  const lines = [];
  for (let i = 0; i <= 6; i++) {
    const p = i * 24;
    lines.push(<Line key={`v${i}`} x1={p} y1={0} x2={p} y2={384} stroke={colors.fieldLine} strokeWidth={0.5} opacity={0.5} />);
  }
  for (let j = 0; j <= 16; j++) {
    const p = j * 24;
    lines.push(<Line key={`h${j}`} x1={0} y1={p} x2={144} y2={p} stroke={colors.fieldLine} strokeWidth={0.5} opacity={0.5} />);
  }
  const route = [[24, 300], [72, 252], [60, 192], [120, 156]];

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 144 384"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
    >
      {lines}
      <Polyline
        points={route.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        opacity={0.55}
      />
      {route.map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={3.5} fill={colors.bg} stroke={colors.primary} strokeWidth={1.5} opacity={0.8} />
      ))}
    </Svg>
  );
}