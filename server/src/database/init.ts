import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(dbPath);

export async function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 用户表
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          username TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_code TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 算法表
      db.run(`
        CREATE TABLE IF NOT EXISTS algorithms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          complexity_best TEXT,
          complexity_average TEXT,
          complexity_worst TEXT,
          space_complexity TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 题目表
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          difficulty TEXT NOT NULL,
          algorithm_id INTEGER,
          test_cases TEXT,
          solution TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (algorithm_id) REFERENCES algorithms (id)
        )
      `);

      // 用户错题本表
      db.run(`
        CREATE TABLE IF NOT EXISTS wrong_answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          question_id INTEGER NOT NULL,
          user_answer TEXT,
          is_correct BOOLEAN DEFAULT FALSE,
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (question_id) REFERENCES questions (id)
        )
      `);

      // 用户进度表
      db.run(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          algorithm_id INTEGER NOT NULL,
          completed_questions INTEGER DEFAULT 0,
          total_questions INTEGER DEFAULT 0,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (algorithm_id) REFERENCES algorithms (id)
        )
      `);

      // 插入默认的八大排序算法
      db.run(`
        INSERT OR IGNORE INTO algorithms (name, description, complexity_best, complexity_average, complexity_worst, space_complexity, category) VALUES
        ('冒泡排序', '通过重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', '交换排序'),
        ('选择排序', '在未排序序列中找到最小元素，存放到排序序列的起始位置，然后从剩余未排序元素中继续寻找最小元素', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', '选择排序'),
        ('插入排序', '构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', '插入排序'),
        ('希尔排序', '是插入排序的一种更高效的改进版本，通过比较相距一定间隔的元素来工作', 'O(n log n)', 'O(n^1.3)', 'O(n²)', 'O(1)', '插入排序'),
        ('归并排序', '采用分治法，将已有序的子序列合并，得到完全有序的序列', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', '归并排序'),
        ('快速排序', '使用分治法策略来把一个序列分为较小和较大的2个子序列，然后递归地排序两个子序列', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', '交换排序'),
        ('堆排序', '利用堆这种数据结构所设计的排序算法，是一种选择排序', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', '选择排序'),
        ('计数排序', '不是基于比较的排序算法，其核心在于将输入的数据值转化为键存储在额外开辟的数组空间中', 'O(n+k)', 'O(n+k)', 'O(n+k)', 'O(k)', '非比较排序')
      `);

      // 插入一些示例题目
      db.run(`
        INSERT OR IGNORE INTO questions (title, description, difficulty, algorithm_id, test_cases, solution) VALUES
        ('冒泡排序基础', '实现冒泡排序算法，对数组 [64, 34, 25, 12, 22, 11, 90] 进行排序', '简单', 1, '[64,34,25,12,22,11,90]', 'function bubbleSort(arr) { for(let i = 0; i < arr.length; i++) { for(let j = 0; j < arr.length - i - 1; j++) { if(arr[j] > arr[j+1]) { [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; } } } return arr; }'),
        ('选择排序实现', '使用选择排序对数组 [5, 2, 4, 6, 1, 3] 进行排序', '简单', 2, '[5,2,4,6,1,3]', 'function selectionSort(arr) { for(let i = 0; i < arr.length; i++) { let min = i; for(let j = i + 1; j < arr.length; j++) { if(arr[j] < arr[min]) min = j; } [arr[i], arr[min]] = [arr[min], arr[i]]; } return arr; }'),
        ('快速排序挑战', '实现快速排序算法，并分析其时间复杂度', '困难', 6, '[3,7,8,5,2,1,9,5,4]', 'function quickSort(arr) { if(arr.length <= 1) return arr; const pivot = arr[Math.floor(arr.length/2)]; const left = arr.filter(x => x < pivot); const right = arr.filter(x => x > pivot); return [...quickSort(left), pivot, ...quickSort(right)]; }')
      `);

      db.run('PRAGMA foreign_keys = ON');
      
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Database initialized successfully');
          resolve();
        }
      });
    });
  });
} 