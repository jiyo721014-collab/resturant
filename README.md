# Ric's Diner - 點餐系統

使用 Material-UI 和 React + TypeScript 構建的餐廳點餐應用。

## 功能特色

- 🎨 精美的 Material-UI 設計
- 📱 響應式布局，適配各種設備
- 🍽️ 完整的菜單瀏覽功能
- 🏷️ 類別篩選（套餐組合、各類菜品、素食）
- 🖼️ 菜品圖片展示
- 🛒 購物車按鈕（UI 已實現）

## 技術棧

- React 19.2.0
- TypeScript 5.9.3
- Material-UI (MUI) 7.3.2
- Vite 7.2.4

## 安裝與運行

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發服務器

```bash
npm run dev
```

應用將在 `http://localhost:5173` 啟動。

### 3. 構建生產版本

```bash
npm run build
```

## 項目結構

```
new-my-restaurant-app/
├── public/
│   └── data/
│       ├── dish-data.csv      # 菜品數據
│       └── sample*.jpg         # 菜品圖片
├── src/
│   ├── components/
│   │   ├── CategoryBar.tsx     # 類別導航欄
│   │   ├── MenuList.tsx        # 左側菜單列表
│   │   ├── DishDetail.tsx      # 右側詳情面板
│   │   └── ComboList.tsx       # 套餐列表
│   ├── utils/
│   │   └── dishData.ts        # 數據工具函數
│   ├── App.tsx                 # 主應用組件
│   ├── main.tsx                # 應用入口
│   └── index.css               # 全局樣式
└── package.json
```

## 功能說明

### 類別篩選

- **套餐組合**：顯示單人、雙人、三人、四人套餐選項
- **CSV 類別**：根據 `dish-data.csv` 中的類別欄位自動生成
- **素食**：篩選飲食標籤中包含"素"、"純素"的菜品

### 菜單瀏覽

- 左側顯示當前類別的所有菜品
- 點擊菜品可在右側查看詳情
- 右側顯示菜品圖片、描述、標籤和價格
- 包含"加入購物車"按鈕（UI 已實現）

## 數據格式

菜品數據存儲在 `public/data/dish-data.csv`，格式如下：

```
料號,類別,品名,描述,飲食標籤,辣度,價格TWD
```

## 開發說明

- 使用 Material-UI 主題系統進行樣式管理
- 所有組件使用 TypeScript 類型定義
- 響應式設計，支持移動端和桌面端
- 圖片路徑：`/data/sample{1-7}.jpg`

## 待實現功能

- [ ] 購物車功能
- [ ] 結帳流程
- [ ] 訂單管理
- [ ] 用戶登錄

