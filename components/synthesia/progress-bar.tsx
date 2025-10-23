interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = (completed / total) * 100;
  
  return (
    <>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-full flex justify-between text-xs">
        <span>
          {completed} / {total} completed
        </span>
        <span>{total - completed} to go</span>
      </div>
    </>
  );
}