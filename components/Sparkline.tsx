type Props = {
  values: number[];
  max?: number;
  min?: number;
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  ariaLabel: string;
};

export default function Sparkline({
  values,
  max,
  min,
  width = 320,
  height = 80,
  stroke = "#0f0f0f",
  fill = "rgba(15,15,15,0.08)",
  ariaLabel,
}: Props) {
  if (values.length === 0) {
    return (
      <div
        className="flex items-center justify-center border border-rule bg-surface text-xs text-muted"
        style={{ width, height }}
        role="img"
        aria-label={`${ariaLabel} (no data)`}
      >
        No data yet
      </div>
    );
  }
  const lo = min ?? Math.min(...values, 0);
  const hi = max ?? Math.max(...values, 1);
  const range = hi - lo || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - lo) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `0,${height} ${points} ${width},${height}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className="block w-full"
      preserveAspectRatio="none"
    >
      <polygon points={area} fill={fill} />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.25} />
    </svg>
  );
}
