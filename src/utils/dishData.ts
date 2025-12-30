export interface Dish {
  料號: string;
  類別: string;
  品名: string;
  描述: string;
  飲食標籤: string;
  辣度: string;
  價格TWD: number;
}

export interface Category {
  name: string;
  displayName: string;
}

// 解析 CSV 数据
export async function loadDishData(): Promise<Dish[]> {
  try {
    const response = await fetch('/data/dish-data.csv');
    if (!response.ok) {
      console.error('Failed to fetch dish data:', response.status, response.statusText);
      return [];
    }
    const text = await response.text();
    if (!text) {
      console.error('Dish data file is empty');
      return [];
    }
    const lines = text.split('\n').filter(line => line.trim());
    
    // 跳过标题行
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      // CSV 解析（处理引号内的逗号）
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      return {
        料號: values[0] || '',
        類別: values[1] || '',
        品名: values[2] || '',
        描述: values[3] || '',
        飲食標籤: values[4] || '',
        辣度: values[5] || '0',
        價格TWD: parseInt(values[6] || '0', 10),
      };
    }).filter(dish => dish.品名); // 过滤空行
  } catch (error) {
    console.error('Error loading dish data:', error);
    return [];
  }
}

// 获取所有类别（不包括套餐组合，只包括 CSV 类别和素食）
export function getCategories(dishes: Dish[]): Category[] {
  const categorySet = new Set<string>();
  dishes.forEach(dish => {
    if (dish.類別) {
      categorySet.add(dish.類別);
    }
  });
  
  const categories: Category[] = [];
  
  // 添加 CSV 中的类别
  Array.from(categorySet).forEach(name => {
    categories.push({
      name,
      displayName: name,
    });
  });
  
  // 添加"素食"类别
  categories.push({
    name: '素食',
    displayName: '素食',
  });
  
  return categories;
}

// 根据类别筛选菜品
export function getDishesByCategory(dishes: Dish[], category: string): Dish[] {
  if (category === '套餐組合') {
    // 返回空数组，套餐需要特殊处理
    return [];
  }
  
  if (category === '素食') {
    return dishes.filter(dish => 
      dish.飲食標籤 && (
        dish.飲食標籤.includes('素食') || 
        dish.飲食標籤.includes('純素') ||
        dish.飲食標籤.includes('素')
      )
    );
  }
  
  return dishes.filter(dish => dish.類別 === category);
}

// 获取套餐列表
export function getComboMeals(): Array<{ id: string; name: string; icon: string }> {
  return [
    { id: 'single', name: '單人套餐', icon: '👤' },
    { id: 'double', name: '雙人套餐', icon: '👥' },
    { id: 'triple', name: '三人套餐', icon: '👨‍👩‍👧' },
    { id: 'quad', name: '四人套餐', icon: '👨‍👩‍👧‍👦' },
  ];
}

// 获取随机图片路径
export function getRandomImage(): string {
  const imageNumbers = [1, 2, 3, 4, 5, 6, 7];
  const randomNum = imageNumbers[Math.floor(Math.random() * imageNumbers.length)];
  return `/data/sample${randomNum}.jpg`;
}

