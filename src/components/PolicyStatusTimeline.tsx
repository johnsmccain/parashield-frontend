import type { Policy } from '@/types';
import { formatDate } from '@/lib/format';

interface PolicyStatusTimelineProps {
  policy:    Policy;
  className?: string;
}

interface TimelineEvent {
  label: string;
  date:  string;
  done:  boolean;
}

export function PolicyStatusTimeline({ policy, className }: PolicyStatusTimelineProps) {
  const events: TimelineEvent[] = [
    { label: 'Policy purchased',  date: formatDate(policy.startTime), done: true },
    { label: 'Coverage active',   date: formatDate(policy.startTime), done: true },
    {
      label: 'Oracle monitoring',
      date:  'Continuous',
      done:  policy.status === 'Active',
    },
    {
      label: policy.status === 'Claimed' ? 'Claim paid out' : 'Policy expires',
      date:  formatDate(policy.endTime),
      done:  policy.status === 'Claimed' || policy.status === 'Expired',
    },
  ];

  return (
    <div className={`relative ${className ?? ''}`}>
      <div className="absolute left-3 top-0 h-full w-px bg-white/10" />
      <ol className="space-y-6">
        {events.map((event, i) => (
          <li key={i} className="relative flex items-start gap-4 pl-8">
            <div
              className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                event.done
                  ? 'bg-teal-500 text-white'
                  : 'border border-white/20 text-gray-600 bg-gray-950'
              }`}
            >
              {event.done ? '✓' : i + 1}
            </div>
            <div>
              <p className={`text-sm font-semibold ${event.done ? 'text-white' : 'text-gray-500'}`}>
                {event.label}
              </p>
              <p className="text-xs text-gray-500">{event.date}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
