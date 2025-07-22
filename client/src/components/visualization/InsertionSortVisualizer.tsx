import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import type { FC } from 'react';
import React, { useState, useRef } from 'react';

interface Step {
  array: number[];
  comparing: [number, number] | null;
  inserted: number | null;
}

function getInsertionSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [{ array: [...arr], comparing: null, inserted: null }];
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    steps.push({ array: [...arr], comparing: [i, j], inserted: null });
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({ array: [...arr], comparing: [j, j + 1], inserted: null });
      j--;
    }
    arr[j + 1] = key;
    steps.push({ array: [...arr], comparing: [j + 1, i], inserted: j + 1 });
  }
  steps.push({ array: [...arr], comparing: null, inserted: null });
  return steps;
}

const DEFAULT_INPUT = [6, 5, 3, 1, 8, 7, 2, 4];

const InsertionSortVisualizer: FC = () => {
  const [input, setInput] = useState(DEFAULT_INPUT.join(','));
  const [steps, setSteps] = useState<Step[]>(getInsertionSortSteps(DEFAULT_INPUT));
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
      setSteps(getInsertionSortSteps(arr));
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
          const isInserted = step.inserted === idx;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center transition-all duration-300 ${isInserted ? 'animate-pulse' : ''}`}
            >
              <div
                className={`w-10 rounded-t-lg flex items-end justify-center text-white font-bold text-lg mb-1 ${
                  isInserted
                    ? 'bg-neon-green shadow-neon-green'
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
          <span className="font-semibold neon-text">时间复杂度：</span> 最好 O(n) | 平均 O(n²) | 最坏 O(n²)
        </div>
        <div>
          <span className="font-semibold neon-text">空间复杂度：</span> O(1)
        </div>
      </div>
    </div>
  );
};

export default InsertionSortVisualizer; 