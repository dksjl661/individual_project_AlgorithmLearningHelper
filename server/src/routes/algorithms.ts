import express from 'express';
import { db } from '../database/init';

const router = express.Router();

// Get all algorithms
router.get('/', async (req, res) => {
  try {
    const algorithms = await db.all('SELECT * FROM algorithms ORDER BY id');
    res.json(algorithms);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get single algorithm details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const algorithm = await db.get('SELECT * FROM algorithms WHERE id = ?', [id]);
    
    if (!algorithm) {
      return res.status(404).json({ error: 'Algorithm not found' });
    }
    
    res.json(algorithm);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get algorithm visualization data
router.get('/:id/visualization', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Provide sample data for visualization for each algorithm
    const visualizationData = {
      1: { // Bubble Sort
        name: 'Bubble Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [34, 25, 12, 22, 11, 64, 90], description: 'First pass' },
          { array: [25, 12, 22, 11, 34, 64, 90], description: 'Second pass' },
          { array: [12, 22, 11, 25, 34, 64, 90], description: 'Third pass' },
          { array: [12, 11, 22, 25, 34, 64, 90], description: 'Fourth pass' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Fifth pass' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorting complete' }
        ]
      },
      2: { // Selection Sort
        name: 'Selection Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [11, 34, 25, 12, 22, 64, 90], description: 'Find minimum and swap' },
          { array: [11, 12, 25, 34, 22, 64, 90], description: 'Second minimum' },
          { array: [11, 12, 22, 34, 25, 64, 90], description: 'Third minimum' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Fourth minimum' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorting complete' }
        ]
      },
      3: { // Insertion Sort
        name: 'Insertion Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [34, 64, 25, 12, 22, 11, 90], description: 'Insert 34' },
          { array: [25, 34, 64, 12, 22, 11, 90], description: 'Insert 25' },
          { array: [12, 25, 34, 64, 22, 11, 90], description: 'Insert 12' },
          { array: [12, 22, 25, 34, 64, 11, 90], description: 'Insert 22' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Insert 11' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorting complete' }
        ]
      },
      4: { // Shell Sort
        name: 'Shell Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [12, 22, 11, 64, 34, 25, 90], description: 'Gap = 3' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Gap = 1' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorting complete' }
        ]
      },
      5: { // Merge Sort
        name: 'Merge Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [64, 34, 25], description: 'Left half' },
          { array: [12, 22, 11, 90], description: 'Right half' },
          { array: [25, 34, 64], description: 'Sort left half' },
          { array: [11, 12, 22, 90], description: 'Sort right half' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Merge sorted halves' }
        ]
      },
      6: { // Quick Sort
        name: 'Quick Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [34, 25, 12, 22, 11, 64, 90], description: 'Pivot = 64' },
          { array: [25, 12, 22, 11, 34, 64, 90], description: 'Pivot = 34' },
          { array: [12, 22, 11, 25, 34, 64, 90], description: 'Pivot = 25' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorting complete' }
        ]
      },
      7: { // Heap Sort
        name: 'Heap Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [90, 34, 25, 12, 22, 11, 64], description: 'Build max heap' },
          { array: [34, 22, 25, 12, 11, 64, 90], description: 'Extract max' },
          { array: [25, 22, 11, 12, 34, 64, 90], description: 'Extract max' },
          { array: [22, 12, 11, 25, 34, 64, 90], description: 'Extract max' },
          { array: [12, 11, 22, 25, 34, 64, 90], description: 'Extract max' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorting complete' }
        ]
      },
      8: { // Counting Sort
        name: 'Counting Sort',
        steps: [
          { array: [64, 34, 25, 12, 22, 11, 90], description: 'Initial array' },
          { array: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], description: 'Count array' },
          { array: [1, 1, 1, 1, 1, 1, 1, 0, 0, 1], description: 'Count frequencies' },
          { array: [1, 2, 3, 4, 5, 6, 7, 7, 7, 8], description: 'Cumulative count' },
          { array: [11, 12, 22, 25, 34, 64, 90], description: 'Sorted array' }
        ]
      }
    };

    const data = visualizationData[id as unknown as keyof typeof visualizationData];
    if (!data) {
      return res.status(404).json({ error: 'Visualization data not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching visualization data:', error);
    res.status(500).json({ error: 'Failed to fetch visualization data' });
  }
});

// Get algorithm code examples
router.get('/:id/code-examples', async (req, res) => {
  try {
    const { id } = req.params;
    
    const codeExamples = {
      1: { // Bubble Sort
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
        javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
        java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
        cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`
      },
      2: { // Selection Sort
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
        javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
        java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
        cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`
      }
    };

    const examples = codeExamples[id as unknown as keyof typeof codeExamples];
    if (!examples) {
      return res.status(404).json({ error: 'Algorithm not found' });
    }
    
    res.json(examples);
  } catch (error) {
    console.error('Error fetching code examples:', error);
    res.status(500).json({ error: 'Failed to fetch code examples' });
  }
});

export { router as algorithmRoutes }; 