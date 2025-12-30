import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Dish } from '../utils/dishData';

interface CartItem {
  dish: Dish;
  quantity: number;
  isSubmitted?: boolean; // 标记是否已送出
  immutable?: boolean; // 标记是否不可修改（已送出的订单）
}

interface CartDialogProps {
  open: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onSubmitOrder: () => void;
}

export default function CartDialog({
  open,
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
}: CartDialogProps) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.dish.價格TWD * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // 计算新加入商品的总价（未送出的且非 immutable）
  const newItemsAmount = cartItems
    .filter(item => !item.immutable && !item.isSubmitted)
    .reduce((sum, item) => sum + item.dish.價格TWD * item.quantity, 0);
  
  // 已送出商品的总价（immutable 或 isSubmitted）
  const submittedItemsAmount = cartItems
    .filter(item => item.immutable || item.isSubmitted)
    .reduce((sum, item) => sum + item.dish.價格TWD * item.quantity, 0);
  
  const hasNewItems = cartItems.some(item => !item.immutable && !item.isSubmitted);

  const handleIncrease = (dishId: string, currentQuantity: number, isImmutable: boolean) => {
    if (!isImmutable) {
      onUpdateQuantity(dishId, currentQuantity + 1);
    }
  };

  const handleDecrease = (dishId: string, currentQuantity: number, isImmutable: boolean) => {
    if (isImmutable) return;
    
    if (currentQuantity > 1) {
      onUpdateQuantity(dishId, currentQuantity - 1);
    } else {
      onRemoveItem(dishId);
    }
  };

  const handleSubmit = () => {
    onSubmitOrder();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            購物車
          </Typography>
          <Typography variant="body2" color="text.secondary">
            共 {totalItems} 項
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              購物車是空的
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請選擇您喜歡的菜品
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* 已送出的订单（immutable） */}
            {cartItems.filter(item => item.immutable || item.isSubmitted).length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', px: 1 }}>
                  已確認訂單
                </Typography>
                {cartItems
                  .filter(item => item.immutable || item.isSubmitted)
                  .map((item) => {
                    const isImmutable = item.immutable || item.isSubmitted || false;
                    return (
                      <Paper
                        key={`submitted-${item.dish.料號}`}
                        elevation={1}
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'grey.100',
                          opacity: 0.7,
                        }}
                      >
                        <Box sx={{ flex: 1, mr: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 0.5,
                              color: 'text.disabled',
                            }}
                          >
                            {item.dish.品名}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.disabled" 
                            sx={{ mb: 1 }}
                          >
                            {item.dish.描述}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'text.disabled',
                            }}
                          >
                            NT$ {item.dish.價格TWD} / 份
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              disabled={isImmutable}
                              onClick={() => !isImmutable && handleDecrease(item.dish.料號, item.quantity, isImmutable)}
                              sx={{
                                border: '1px solid',
                                borderColor: isImmutable ? 'grey.300' : 'divider',
                                color: isImmutable ? 'text.disabled' : 'inherit',
                              }}
                            >
                              {item.quantity === 1 ? (
                                <DeleteIcon fontSize="small" />
                              ) : (
                                <RemoveIcon fontSize="small" />
                              )}
                            </IconButton>
                            <Typography
                              variant="h6"
                              sx={{
                                minWidth: '40px',
                                textAlign: 'center',
                                fontWeight: 600,
                                color: 'text.disabled',
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              disabled={isImmutable}
                              onClick={() => !isImmutable && handleIncrease(item.dish.料號, item.quantity, isImmutable)}
                              sx={{
                                border: '1px solid',
                                borderColor: isImmutable ? 'grey.300' : 'divider',
                                color: isImmutable ? 'text.disabled' : 'inherit',
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              minWidth: '100px',
                              textAlign: 'right',
                              fontWeight: 700,
                              color: 'text.disabled',
                            }}
                          >
                            NT$ {item.dish.價格TWD * item.quantity}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                <Divider sx={{ my: 1 }} />
              </>
            )}

            {/* 新加入的商品（可修改） */}
            {cartItems.filter(item => !item.immutable && !item.isSubmitted).length > 0 && (
              <>
                {cartItems.filter(item => item.immutable || item.isSubmitted).length > 0 && (
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.dark', px: 1 }}>
                    加點
                  </Typography>
                )}
                {cartItems
                  .filter(item => !item.immutable && !item.isSubmitted)
                  .map((item) => {
                    const isImmutable = item.immutable || false;
                    return (
                      <Paper
                        key={`new-${item.dish.料號}`}
                        elevation={1}
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box sx={{ flex: 1, mr: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {item.dish.品名}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.dish.描述}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            NT$ {item.dish.價格TWD} / 份
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleDecrease(item.dish.料號, item.quantity, isImmutable)}
                              disabled={isImmutable}
                              sx={{
                                border: '1px solid',
                                borderColor: isImmutable ? 'grey.300' : 'divider',
                                color: isImmutable ? 'text.disabled' : 'inherit',
                              }}
                            >
                              {item.quantity === 1 ? (
                                <DeleteIcon fontSize="small" />
                              ) : (
                                <RemoveIcon fontSize="small" />
                              )}
                            </IconButton>
                            <Typography
                              variant="h6"
                              sx={{
                                minWidth: '40px',
                                textAlign: 'center',
                                fontWeight: 600,
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleIncrease(item.dish.料號, item.quantity, isImmutable)}
                              disabled={isImmutable}
                              sx={{
                                border: '1px solid',
                                borderColor: isImmutable ? 'grey.300' : 'divider',
                                color: isImmutable ? 'text.disabled' : 'inherit',
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              minWidth: '100px',
                              textAlign: 'right',
                              fontWeight: 700,
                              color: 'success.dark',
                            }}
                          >
                            NT$ {item.dish.價格TWD * item.quantity}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
              </>
            )}

            <Divider sx={{ my: 1 }} />

            {/* 已確認訂單总计 */}
            {submittedItemsAmount > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  mb: hasNewItems ? 1 : 0,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.disabled' }}>
                  已確認訂單
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.disabled' }}>
                  NT$ {submittedItemsAmount}
                </Typography>
              </Box>
            )}

            {/* 加點总计 - 綠色 */}
            {hasNewItems && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'success.light',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.dark' }}>
                  加點
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.dark' }}>
                  NT$ {newItemsAmount}
                </Typography>
              </Box>
            )}

            {/* 总总计 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                總計
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: hasNewItems ? 'success.dark' : 'primary.main',
                }}
              >
                NT$ {totalAmount}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: '100px' }}>
          關閉
        </Button>
        {hasNewItems && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ minWidth: '120px' }}
            size="large"
          >
            送出訂單
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

