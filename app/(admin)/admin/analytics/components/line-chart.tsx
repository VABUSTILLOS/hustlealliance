'use client';

export type ChartPoint = { label: string; value: number };

type LineChartProps = {
  data: ChartPoint[];
  height?: number;
  color?: string;
};

/** Dependency-free responsive SVG line chart with area fill and tooltips. */
export default function LineChart({ data, height = 160, color = '#FF3B30' }: LineChartProps) {
  const chartW = 600;
  const chartH = height;

  if (data.length === 0) {
    return <p className="text-sm text-muted">No data for this range.</p>;
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const span = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * (chartW - 60) + 50 : chartW / 2;
    const y = chartH - ((d.value - minVal) / span) * chartH;
    return { x, y, d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH} L ${points[0].x} ${chartH} Z`;

  const firstLabel = data[0]?.label ?? '';
  const midLabel = data[Math.floor(data.length / 2)]?.label ?? '';
  const lastLabel = data[data.length - 1]?.label ?? '';

  return (
    <svg width="100%" height={chartH + 30} viewBox={`0 0 ${chartW} ${chartH + 30}`} preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <line key={pct} x1={40} y1={chartH - pct * chartH} x2={chartW - 20} y2={chartH - pct * chartH} stroke="#1C1C1E" strokeWidth={0.5} />
      ))}
      <path d={areaPath} fill={color} opacity={0.12} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color}>
          <title>{`${p.d.label}: ${p.d.value}`}</title>
        </circle>
      ))}
      <text x={points[0].x} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="start">
        {firstLabel}
      </text>
      <text x={points[Math.floor(points.length / 2)].x} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="middle">
        {midLabel}
      </text>
      <text x={points[points.length - 1].x} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="end">
        {lastLabel}
      </text>
    </svg>
  );
}
