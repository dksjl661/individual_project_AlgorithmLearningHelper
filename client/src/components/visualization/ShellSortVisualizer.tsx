import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import type { FC } from 'react';
import React, { useState, useRef } from 'react';

interface Step {
  array: number[];
  comparing: [number, number] | null;
  gap: number;
  swapped: boolean;
}

function getShellSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const n = arr.length;
  let gap = Math.floor(n / 2);
  steps.push({ array: [...arr], comparing: null, gap, swapped: false });
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;
      steps.push({ array: [...arr], comparing: [j, j - gap], gap, swapped: false });
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        steps.push({ array: [...arr], comparing: [j, j - gap], gap, swapped: true });
        j -= gap;
      }
      arr[j] = temp;
      steps.push({ array: [...arr], comparing: [j, i], gap, swapped: false });
    }
    gap = Math.floor(gap / 2);
    steps.push({ array: [...arr], comparing: null, gap, swapped: false });
  }
  steps.push({ array: [...arr], comparing: null, gap: 0, swapped: false });
  return steps;
}

const DEFAULT_INPUT = [8, 3, 5, 4, 7, 6, 1, 2];

const ShellSortVisualizer: FC = () => {
  const [input, setInput] = useState(DEFAULT_INPUT.join(','));
  const [steps, setSteps] = useState<Step[]>(getShellSortSteps(DEFAULT_INPUT));
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
      setSteps(getShellSortSteps(arr));
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
      <div className="flex items-end justify-center space-x-2 h-40 mb-4">
        {step.array.map((num: number, idx: number) => {
          const isComparing = step.comparing && (idx === step.comparing[0] || idx === step.comparing[1]);
          const isSwapped = isComparing && step.swapped;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center transition-all duration-300 ${isSwapped ? 'animate-pulse' : ''}`}
            >
              <div
                className={`w-10 rounded-t-lg flex items-end justify-center text-white font-bold text-lg mb-1 ${
                  isSwapped
                    ? 'bg-neon-pink shadow-neon-pink'
                    : isComparing
                    ? 'bg-neon-yellow shadow-neon-yellow'
                    : 'bg-neon-blue shadow-neon-blue'
                }`}
                style={{ height: `${num * 2 + 30}px` }}
              >
                {num}
              </div>
              <div className="text-xs text-gray-400">{idx}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-300">
        <div>
          步骤：{current + 1} / {steps.length}
        </div>
        <div>
          <span className="font-semibold neon-text">时间复杂度：</span> 最好 O(n log n) | 平均 O(n^1.3) | 最坏 O(n²)
        </div>
        <div>
          <span className="font-semibold neon-text">空间复杂度：</span> O(1)
        </div>
      </div>
    </div>
  );
};

export default ShellSortVisualizer; 