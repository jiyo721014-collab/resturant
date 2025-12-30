import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type { Dish } from '../utils/dishData';
import { getRandomImage } from '../utils/dishData';
import QuantityDialog from './QuantityDialog';

interface DishDetailProps {
  dish: Dish | null;
  onAddToCart?: (dish: Dish, quantity: number) => void;
}

export default function DishDetail({ dish, onAddToCart }: DishDetailProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddToCart = () => {
    if (dish) {
      setDialogOpen(true);
    }
  };

  const handleConfirm = (dish: Dish, quantity: number) => {
    if (onAddToCart) {
      onAddToCart(dish, quantity);
    }
  };

  if (!dish) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          請選擇一個菜品查看詳情
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          height: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* 图片区域 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            position: 'relative',
            minHeight: '400px',
          }}
        >
          <Box
            component="img"
            src={getRandomImage()}
            alt={dish.品名}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 500,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            食物圖片
          </Box>
        </Box>

        {/* 购物车按钮 - 在图片下方中央 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            py: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: '200px',
            }}
          >
            加入購物車
          </Button>
        </Box>

        {/* 详情区域 */}
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {dish.品名}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {dish.描述}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {dish.飲食標籤 && (
                <Typography variant="body2" color="text.secondary">
                  標籤: {dish.飲食標籤}
                </Typography>
              )}
              {dish.辣度 && dish.辣度 !== '0' && (
                <Typography variant="body2" color="error">
                  🌶️ 辣度 {dish.辣度}
                </Typography>
              )}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              NT$ {dish.價格TWD}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <QuantityDialog
        open={dialogOpen}
        dish={dish}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
