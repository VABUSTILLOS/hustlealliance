'use client';

export type ChartPoint = { label: string; value: number };

type BarChartProps = {
  data: ChartPoint[];
  height?: number;
  color?: string;
};

/** Dependency-free responsive SVG vertical bar chart. */
export default function BarChart({ data, height = 160, color = '#3B82F6' }: BarChartProps) {
  const chartW = 600;
  const chartH = height;

  if (data.length === 0) {
    return <p className="text-sm text-muted">No data for this range.</p>;
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const barW = Math.max(6, Math.min(30, (chartW - 60) / data.length));

  const firstLabel = data[0]?.label ?? '';
  const midLabel = data[Math.floor(data.length / 2)]?.label ?? '';
  const lastLabel = data[data.length - 1]?.label ?? '';

  return (
    <svg width="100%" height={chartH + 30} viewBox={`0 0 ${chartW} ${chartH + 30}`} preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <g key={pct}>
          <line x1={40} y1={chartH - pct * chartH} x2={chartW - 20} y2={chartH - pct * chartH} stroke="#1C1C1E" strokeWidth={0.5} />
          <text x={34} y={chartH - pct * chartH + 4} fill="#8A8A8A" fontSize={10} textAnchor="end">
            {Math.round(maxVal * pct)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.value / maxVal) * chartH;
        const x = 50 + i * ((chartW - 70) / data.length);
        return (
          <rect key={i} x={x} y={chartH - h} width={barW} height={h} rx={2} fill={color} opacity={0.85}>
            <title>{`${d.label}: ${d.value}`}</title>
          </rect>
        );
      })}
      <text x={50} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="start">
        {firstLabel}
      </text>
      <text x={chartW / 2} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="middle">
        {midLabel}
      </text>
      <text x={chartW - 20} y={chartH + 16} fill="#8A8A8A" fontSize={8} textAnchor="end">
        {lastLabel}
      </text>
    </svg>
  );
}
