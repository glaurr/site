const WIDTH = 96;
const HEIGHT = 28;
const PAD = 3;

/*
  The week's prices as one line, scaled to that coin's own low and high: it
  shows the shape of the week, not how the coin compares with the other rows.
  The dot is the latest price, coloured by which way the week went.
*/
export function Sparkline({
  points,
  label,
}: {
  points: number[];
  label: string;
}) {
  if (points.length < 2) return null;

  const low = Math.min(...points);
  const high = Math.max(...points);
  const span = high - low || 1;

  const coords = points.map((point, index) => ({
    x: PAD + (index / (points.length - 1)) * (WIDTH - PAD * 2),
    y: PAD + (1 - (point - low) / span) * (HEIGHT - PAD * 2),
  }));
  const last = coords[coords.length - 1];
  const rising = points[points.length - 1] >= points[0];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label={label}
    >
      <polyline
        points={coords.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink-soft"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r={2.5}
        className={rising ? "fill-gain" : "fill-accent"}
      />
    </svg>
  );
}
