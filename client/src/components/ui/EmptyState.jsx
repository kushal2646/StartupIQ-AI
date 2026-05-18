import { HiLightBulb } from 'react-icons/hi';

const EmptyState = ({ 
  icon: Icon = HiLightBulb, 
  title = 'Nothing here yet', 
  description = 'Get started by creating something new',
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] text-center max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
