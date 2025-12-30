import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, Typography, Box, Button, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Dish } from './utils/dishData';
import { loadDishData, getCategories, getDishesByCategory } from './utils/dishData';
import CategoryBar from './components/CategoryBar';
import MenuList from './components/MenuList';
import DishDetail from './components/DishDetail';
import CartDialog from './components/CartDialog';
import OrderConfirmationDialog from './components/OrderConfirmationDialog';

// 创建 Material-UI 主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#c8a882',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; displayName: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Array<{ dish: Dish; quantity: number; isSubmitted?: boolean; immutable?: boolean }>>([]);
  const [autoSelectFirst, setAutoSelectFirst] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false);
  const [orderData, setOrderData] = useState<{
    items: Array<{ dish: { 品名: string; 價格TWD: number }; quantity: number }>;
    totalAmount: number;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const loadedDishes = await loadDishData();
        const loadedCategories = getCategories(loadedDishes);
        setDishes(loadedDishes);
        setCategories(loadedCategories);
        
        // 默认选择第一个类别
        if (loadedCategories.length > 0) {
          setSelectedCategory(loadedCategories[0].name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = getDishesByCategory(dishes, selectedCategory);
      setFilteredDishes(filtered);
      // 切换分类时，清除当前选择并触发自动选择第一项
      setSelectedDish(null);
      setAutoSelectFirst(true);
    }
  }, [selectedCategory, dishes]);

  // 自动选择第一项后，重置标志
  useEffect(() => {
    if (autoSelectFirst && selectedDish) {
      setAutoSelectFirst(false);
    }
  }, [autoSelectFirst, selectedDish]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedDish(null);
  };

  const handleDishSelect = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleAddToCart = (dish: Dish, quantity: number) => {
    setCartItems(prev => {
      // 检查是否有未送出的相同菜品
      const existingNewItem = prev.find(
        item => item.dish.料號 === dish.料號 && !item.immutable && !item.isSubmitted
      );
      
      if (existingNewItem) {
        // 如果存在未送出的相同菜品，合并数量
        return prev.map(item =>
          item.dish.料號 === dish.料號 && !item.immutable && !item.isSubmitted
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // 如果不存在未送出的相同菜品，添加新项目（即使有已送出的相同菜品）
      return [...prev, { dish, quantity, isSubmitted: false, immutable: false }];
    });
    console.log('Added to cart:', dish.品名, 'x', quantity);
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        // 只更新未送出的且非 immutable 的商品
        item.dish.料號 === dishId && !item.immutable && !item.isSubmitted 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCartItems(prev => 
      // 只删除未送出的且非 immutable 的商品
      prev.filter(item => item.dish.料號 !== dishId || item.immutable || item.isSubmitted)
    );
  };

  const handleSubmitOrder = () => {
    // 只获取新加入的商品（未送出的）
    const newItems = cartItems.filter(item => !item.immutable && !item.isSubmitted);
    
    // 总价应该包括所有购物车中的商品（已确认的 + 新加入的）
    const totalAmount = cartItems.reduce((sum, item) => sum + item.dish.價格TWD * item.quantity, 0);
    
    // 已确认订单的总价
    const submittedItemsAmount = cartItems
      .filter(item => item.immutable || item.isSubmitted)
      .reduce((sum, item) => sum + item.dish.價格TWD * item.quantity, 0);
    
    // 新加入商品的总价
    const newItemsAmount = newItems.reduce((sum, item) => sum + item.dish.價格TWD * item.quantity, 0);
    
    const orderData = {
      items: newItems.map(item => ({
        dish: {
          品名: item.dish.品名,
          價格TWD: item.dish.價格TWD,
        },
        quantity: item.quantity,
      })),
      submittedItemsAmount, // 已确认订单总价
      newItemsAmount, // 新加入商品总价
      totalAmount, // 总总计（已确认 + 新加入）
    };

    // 发送订单到后台（这里使用 console.log 模拟，实际应该调用 API）
    console.log('=== 訂單已送出 ===');
    console.log('訂單詳情:', JSON.stringify(orderData, null, 2));
    console.log('時間:', new Date().toLocaleString('zh-TW'));
    console.log('==================');

    // 可以在这里添加实际的 API 调用
    // fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData),
    // });

    // 将新加入的商品标记为已送出和 immutable（不可修改）
    setCartItems(prev =>
      prev.map(item => {
        const isNewItem = newItems.some(newItem => newItem.dish.料號 === item.dish.料號);
        return {
          ...item,
          isSubmitted: item.isSubmitted || isNewItem,
          immutable: item.immutable || isNewItem, // 标记为不可修改
        };
      })
    );

    setOrderData(orderData);
    setCartOpen(false); // 关闭购物车对话框
    setOrderConfirmationOpen(true); // 显示确认对话框
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>載入中...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部 AppBar */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Aruba's Diner
            </Typography>
            <Button
              variant="text"
              color="inherit"
              startIcon={
                <Badge badgeContent={cartItems.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              }
              onClick={() => setCartOpen(true)}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              購物車
            </Button>
          </Toolbar>
        </AppBar>

        {/* 类别导航栏 */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* 主内容区域 - 3:7 比例 */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 左侧菜单列表 - 30% (3/10) */}
          <Box
            sx={{
              width: { xs: '100%', md: '30%' },
              p: 2,
              borderRight: { md: '1px solid' },
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <MenuList
              dishes={filteredDishes}
              selectedDish={selectedDish}
              onDishSelect={handleDishSelect}
              onAddToCart={handleAddToCart}
              autoSelectFirst={autoSelectFirst}
            />
          </Box>

          {/* 右侧详情面板 - 70% (7/10) */}
          <Box
            sx={{
              width: { xs: '100%', md: '70%' },
              p: 2,
              overflow: 'hidden',
            }}
          >
            <DishDetail dish={selectedDish} onAddToCart={handleAddToCart} />
          </Box>
        </Box>
      </Box>

      {/* 购物车对话框 */}
      <CartDialog
        open={cartOpen}
        cartItems={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* 订单确认对话框 */}
      <OrderConfirmationDialog
        open={orderConfirmationOpen}
        orderData={orderData}
        onClose={() => setOrderConfirmationOpen(false)}
      />
    </ThemeProvider>
  );
}

export default App;
