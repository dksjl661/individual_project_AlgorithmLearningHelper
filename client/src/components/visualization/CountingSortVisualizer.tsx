import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import type { FC } from 'react';
import React, { useState, useRef } from 'react';

interface Step {
  array: number[];
  count: number[];
  output: number[];
  current: number;
  phase: 'count' | 'cumulate' | 'output';
}

function getCountingSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const max = Math.max(...input);
  const count = new Array(max + 1).fill(0);
  const output = new Array(input.length).fill(0);
  
  // Count phase
  steps.push({
    array: [...input],
    count: [...count],
    output: [...output],
    current: 0,
    phase: 'count'
  });
  
  for (let i = 0; i < input.length; i++) {
    count[input[i]]++;
    steps.push({
      array: [...input],
      count: [...count],
      output: [...output],
      current: input[i],
      phase: 'count'
    });
  }
  
  // Cumulative count phase
  steps.push({
    array: [...input],
    count: [...count],
    output: [...output],
    current: 0,
    phase: 'cumulate'
  });
  
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    steps.push({
      array: [...input],
      count: [...count],
      output: [...output],
      current: i,
      phase: 'cumulate'
    });
  }
  
  // Output phase
  steps.push({
    array: [...input],
    count: [...count],
    output: [...output],
    current: 0,
    phase: 'output'
  });
  
  for (let i = input.length - 1; i >= 0; i--) {
    const value = input[i];
    const position = count[value] - 1;
    output[position] = value;
    count[value]--;
    steps.push({
      array: [...input],
      count: [...count],
      output: [...output],
      current: value,
      phase: 'output'
    });
  }
  
  return steps;
}

const DEFAULT_INPUT = [4, 2, 1, 4, 1, 3, 2, 1];

const CountingSortVisualizer: FC = () => {
  const [input, setInput] = useState(DEFAULT_INPUT.join(','));
  const [steps, setSteps] = useState<Step[]>(getCountingSortSteps(DEFAULT_INPUT));
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSetArray = () => {
    const arr = input
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    if (arr.length > 1) {
      setSteps(getCountingSortSteps(arr));
      setCurrent(0);
      setPlaying(false);
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    timer.current = setInterval(() => {
      setCurrent((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setPlaying(false);
          if (timer.current) clearInterval(timer.current);
          return prev;
        }
      });
    }, 700);
  };

  const handlePause = () => {
    setPlaying(false);
    if (timer.current) clearInterval(timer.current);
  };

  const handleStep = (dir: 1 | -1) => {
    setCurrent((prev) => {
      let next = prev + dir;
      if (next < 0) next = 0;
      if (next > steps.length - 1) next = steps.length - 1;
      return next;
    });
    setPlaying(false);
    if (timer.current) clearInterval(timer.current);
  };

  const handleReset = () => {
    setCurrent(0);
    setPlaying(false);
    if (timer.current) clearInterval(timer.current);
  };

  const step = steps[current];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 card mt-8">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="input-field flex-1 mb-2 md:mb-0"
          placeholder="输入数组，如 5,3,8,2,1"
        />
        <button className="btn-secondary ml-0 md:ml-2" onClick={handleSetArray}>
          设置数组
        </button>
        <button className="btn-secondary ml-2" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1 inline" />重置
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 mb-4">
        <button
          className="btn-secondary"
          onClick={() => handleStep(-1)}
          disabled={current === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {playing ? (
          <button className="btn-primary" onClick={handlePause}>
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button className="btn-primary" onClick={handlePlay} disabled={current === steps.length - 1}>
            <Play className="w-4 h-4" />
          </button>
        )}
        <button
          className="btn-secondary"
          onClick={() => handleStep(1)}
          disabled={current === steps.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-4">
        <div className="text-sm font-semibold neon-text-green mb-2">原始数组：</div>
        <div className="flex items-end justify-center space-x-2 h-32">
          {step.array.map((num: number, idx: number) => {
            const isCurrent = num === step.current;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? 'animate-pulse' : ''}`}
              >
                <div
                  className={`w-8 rounded-t-lg flex items-end justify-center text-white font-bold text-sm mb-1 ${
                    isCurrent ? 'bg-neon-yellow shadow-neon-yellow' : 'bg-neon-blue shadow-neon-blue'
                  }`}
                  style={{ height: `${num * 2 + 20}px` }}
                >
                  {num}
                </div>
                <div className="text-xs text-gray-400">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-sm font-semibold neon-text-blue mb-2">计数数组：</div>
        <div className="flex items-end justify-center space-x-1 h-24">
          {step.count.map((count: number, idx: number) => {
            const isCurrent = idx === step.current;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? 'animate-pulse' : ''}`}
              >
                <div
                  className={`w-6 rounded-t-lg flex items-end justify-center text-white font-bold text-xs mb-1 ${
                    isCurrent ? 'bg-neon-green shadow-neon-green' : 'bg-neon-blue shadow-neon-blue'
                  }`}
                  style={{ height: `${count * 2 + 15}px` }}
                >
                  {count}
                </div>
                <div className="text-xs text-gray-400">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-sm font-semibold neon-text-pink mb-2">输出数组：</div>
        <div className="flex items-end justify-center space-x-2 h-32">
          {step.output.map((num: number, idx: number) => {
            const isCurrent = num === step.current;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? 'animate-pulse' : ''}`}
              >
                <div
                  className={`w-8 rounded-t-lg flex items-end justify-center text-white font-bold text-sm mb-1 ${
                    isCurrent ? 'bg-neon-green shadow-neon-green' : num > 0 ? 'bg-neon-green shadow-neon-green' : 'bg-dark-600'
                  }`}
                  style={{ height: `${num * 2 + 20}px` }}
                >
                  {num}
                </div>
                <div className="text-xs text-gray-400">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-300">
        <div>
          步骤：{current + 1} / {steps.length}
        </div>
        <div>
          <span className="font-semibold neon-text">时间复杂度：</span> 最好 O(n + k) | 平均 O(n + k) | 最坏 O(n + k)
        </div>
        <div>
          <span className="font-semibold neon-text">空间复杂度：</span> O(k)
        </div>
      </div>
    </div>
  );
};

export default CountingSortVisualizer; 