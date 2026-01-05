export const StatsCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className={`p-4 rounded-lg ${color}`}>
    <p className="text-sm opacity-70">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
