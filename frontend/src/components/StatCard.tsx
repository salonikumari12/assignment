import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle?: string;
}

const StatCard = ({ label, value, icon: Icon, color, bgColor, subtitle }: StatCardProps) => {
  return (
    <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5 transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#9191a8] font-medium mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#f1f1f5] leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[#9191a8] mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: bgColor }}
        >
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
