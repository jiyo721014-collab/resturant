import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Chip, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Dish } from '../utils/dishData';
import QuantityDialog from './QuantityDialog';

interface MenuListProps {
  dishes: Dish[];
  selectedDish: Dish | null;
  onDishSelect: (dish: Dish) => void;
  onAddToCart?: (dish: Dish, quantity: number) => void;
  autoSelectFirst?: boolean;
}

export default function MenuList({ dishes, selectedDish, onDishSelect, onAddToCart, autoSelectFirst }: MenuListProps) {
  const firstDishRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDishForCart, setSelectedDishForCart] = useState<Dish | null>(null);

  useEffect(() => {
    if (autoSelectFirst && dishes.length > 0 && !selectedDish) {
      // 自动选中第一项
      onDishSelect(dishes[0]);
    }
  }, [autoSelectFirst, dishes, selectedDish, onDishSelect]);

  useEffect(() => {
    if (selectedDish && firstDishRef.current) {
      firstDishRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedDish]);

  const handleAddToCartClick = (e: React.MouseEvent, dish: Dish) => {
    e.stopPropagation(); // 阻止触发菜品选择
    setSelectedDishForCart(dish);
    setDialogOpen(true);
  };

  const handleConfirm = (dish: Dish, quantity: number) => {
    if (onAddToCart) {
      onAddToCart(dish, quantity);
    }
    setDialogOpen(false);
    setSelectedDishForCart(null);
  };

  return (
    <>
      <Box
        sx={{
          height: 'calc(100vh - 200px)',
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {dishes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography>暫無菜品</Typography>
          </Box>
        ) : (
          dishes.map((dish, index) => (
            <Paper
              key={dish.料號}
              ref={index === 0 ? firstDishRef : null}
              elevation={selectedDish?.料號 === dish.料號 ? 4 : 1}
              onClick={() => onDishSelect(dish)}
              sx={{
                p: 2,
                mb: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedDish?.料號 === dish.料號 ? '2px solid' : '2px solid transparent',
                borderColor: selectedDish?.料號 === dish.料號 ? 'primary.main' : 'transparent',
                bgcolor: selectedDish?.料號 === dish.料號 ? 'action.selected' : 'background.paper',
                '&:hover': {
                  elevation: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* 第一行：品名和价格 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', flex: 1 }}>
                  {dish.品名}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    ml: 2,
                    fontSize: '1.1rem',
                  }}
                >
                  NT$ {dish.價格TWD}
                </Typography>
              </Box>
              
              {/* 第二行：描述 */}
              {dish.描述 && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 1,
                    lineHeight: 1.5,
                  }}
                >
                  {dish.描述}
                </Typography>
              )}
              
              {/* 第三行：饮食标签和辣度（椭圆外框）以及加入购物车按钮 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 1 }}>
                  {dish.飲食標籤 && (
                    <Chip
                      label={dish.飲食標籤}
                      size="small"
                      sx={{
                        height: '24px',
                        fontSize: '0.75rem',
                        borderRadius: '12px',
                        bgcolor: 'action.hover',
                      }}
                    />
                  )}
                  {dish.辣度 && dish.辣度 !== '0' && (
                    <Chip
                      label={`🌶️ 辣度 ${dish.辣度}`}
                      size="small"
                      sx={{
                        height: '24px',
                        fontSize: '0.75rem',
                        borderRadius: '12px',
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                      }}
                    />
                  )}
                </Box>
                <IconButton
                  onClick={(e) => handleAddToCartClick(e, dish)}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <ShoppingCartIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      <QuantityDialog
        open={dialogOpen}
        dish={selectedDishForCart}
        onClose={() => {
          setDialogOpen(false);
          setSelectedDishForCart(null);
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
