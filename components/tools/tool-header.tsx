import { LucideIcon } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
}

const ToolHeader = ({ title, description, icon: Icon, iconColor = "text-primary" }: ToolHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-muted ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ToolHeader;