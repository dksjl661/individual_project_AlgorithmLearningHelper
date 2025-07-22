import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import type { FC } from 'react';
import React, { useState, useRef } from 'react';

interface Step {
  array: number[];
  left: number[];
  right: number[];
  merged: number[];
  comparing: [number, number] | null;
  merging: boolean;
}

function getMergeSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  
  function mergeSort(arr: number[], start: number, end: number): number[] {
    if (end - start <= 1) {
      return arr.slice(start, end);
    }
    
    const mid = Math.floor((start + end) / 2);
    const left = mergeSort(arr, start, mid);
    const right = mergeSort(arr, mid, end);
    
    steps.push({
      array: [...arr],
      left: [...left],
      right: [...right],
      merged: [],
      comparing: null,
      merging: true
    });
    
    const merged = merge(left, right);
    
    // Update the original array
    for (let i = 0; i < merged.length; i++) {
      arr[start + i] = merged[i];
    }
    
    steps.push({
      array: [...arr],
      left: [],
      right: [],
      merged: [...merged],
      comparing: null,
      merging: false
    });
    
    return merged;
  }
  
  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...input],
        left: [...left],
        right: [...right],
        merged: [...result],
        comparing: [left[i], right[j]],
        merging: true
      });
      
      if (left[i] <= right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }
    
    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }
    
    return result;
  }
  
  mergeSort([...input], 0, input.length);
  return steps;
}

const DEFAULT_INPUT = [6, 5, 3, 1, 8, 7, 2, 4];

const MergeSortVisualizer: FC = () => {
  const [input, setInput] = useState(DEFAULT_INPUT.join(','));
  const [steps, setSteps] = useState<Step[]>(getMergeSortSteps(DEFAULT_INPUT));
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
      setSteps(getMergeSortSteps(arr));
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
          const isComparing = step.comparing && (num === step.comparing[0] || num === step.comparing[1]);
          const isMerged = step.merged.includes(num);
          return (
            <div
              key={idx}
              className={`flex flex-col items-center transition-all duration-300 ${isMerged ? 'animate-pulse' : ''}`}
            >
              <div
                className={`w-10 rounded-t-lg flex items-end justify-center text-white font-bold text-lg mb-1 ${
                  isMerged
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
          <span className="font-semibold neon-text">时间复杂度：</span> 最好 O(n log n) | 平均 O(n log n) | 最坏 O(n log n)
        </div>
        <div>
          <span className="font-semibold neon-text">空间复杂度：</span> O(n)
        </div>
      </div>
    </div>
  );
};

export default MergeSortVisualizer; 