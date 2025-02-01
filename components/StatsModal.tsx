'use client';

import { StatisticsData } from '@app/types/Data';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface StatsModalProps {
  onClose: () => void;
  title: string;
  data: StatisticsData;
  defaultMetric: 'wpm' | 'accuracy' | 'errors';
}

const TIME_RANGES = [
  { label: 'Last 10', value: 10 },
  { label: 'Last 25', value: 25 },
  { label: 'Last 50', value: 50 },
  { label: 'Last 100', value: 100 },
  { label: 'All', value: 0 },
];

const StatsModal = ({ onClose, title, data, defaultMetric }: StatsModalProps) => {
  const [timeRange, setTimeRange] = useState(25);
  const [metric, setMetric] = useState<'wpm' | 'accuracy' | 'errors'>(defaultMetric);

  const filterDataByTimeRange = (limit: number) => {
    const timeData = metric === 'wpm' 
      ? data.wpmOverTime 
      : metric === 'accuracy' 
        ? data.accuracyOverTime 
        : data.errorsOverTime;
    
    if (!timeData || timeData.length === 0) {
      return [];
    }

    // Trier les données par date
    const sortedData = timeData
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Si on veut toutes les données
    if (limit === 0) {
      return sortedData
        .reverse()
        .map((point, index) => ({
          index,
          [metric]: metric === 'wpm' 
            ? point.wpm 
            : metric === 'accuracy' 
              ? point.accuracy 
              : point.errors
        }));
    }

    // Prendre les N dernières parties
    return sortedData
      .slice(0, limit)
      .reverse()
      .map((point, index) => ({
        index,
        [metric]: metric === 'wpm' 
          ? point.wpm 
          : metric === 'accuracy' 
            ? point.accuracy 
            : point.errors
      }));
  };

  const processedData = filterDataByTimeRange(timeRange);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-secondary rounded-xl p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">{title}</h2>
          <button onClick={onClose} className="text-text hover:text-text/80">✕</button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setMetric('wpm')}
              className={`px-3 py-1 rounded ${
                metric === 'wpm'
                  ? 'bg-text text-background'
                  : 'bg-tertiary text-text hover:bg-tertiary/80'
              }`}
            >
              WPM
            </button>
            <button
              onClick={() => setMetric('accuracy')}
              className={`px-3 py-1 rounded ${
                metric === 'accuracy'
                  ? 'bg-text text-background'
                  : 'bg-tertiary text-text hover:bg-tertiary/80'
              }`}
            >
              Accuracy
            </button>
            <button
              onClick={() => setMetric('errors')}
              className={`px-3 py-1 rounded ${
                metric === 'errors'
                  ? 'bg-text text-background'
                  : 'bg-tertiary text-text hover:bg-tertiary/80'
              }`}
            >
              Errors
            </button>
          </div>
          <div className="flex gap-4">
            {TIME_RANGES.map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 rounded ${
                  timeRange === range.value
                    ? 'bg-text text-background'
                    : 'bg-tertiary text-text hover:bg-tertiary/80'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#666" />
              <XAxis 
                dataKey="index" 
                stroke="rgb(var(--text))"
                type="number"
                domain={[0, 'auto']}
                tickFormatter={(index) => (index + 1).toString()}
              />
              <YAxis 
                stroke="rgb(var(--text))"
                domain={
                  metric === 'accuracy' ? [0, 100] : 
                  metric === 'errors' ? [0, 'auto'] :
                  [0, 'auto']
                }
                tickFormatter={value => 
                  metric === 'accuracy' ? `${value}%` : value.toString()
                }
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgb(var(--background))',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => 
                  metric === 'accuracy' ? `${value}%` : value
                }
                labelFormatter={(index) => `Game ${index + 1}`}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px'
                }}
                iconSize={10}
                iconType="circle"
                formatter={(value) => <span style={{ marginRight: '40px', color: '#999' }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="rgb(var(--text))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsModal; 