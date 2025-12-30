import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface OrderConfirmationDialogProps {
  open: boolean;
  orderData: {
    items: Array<{ dish: { 品名: string; 價格TWD: number }; quantity: number }>;
    submittedItemsAmount?: number; // 已确认订单总价
    newItemsAmount?: number; // 新加入商品总价
    totalAmount: number; // 总总计
  } | null;
  onClose: () => void;
}

export default function OrderConfirmationDialog({ open, orderData, onClose }: OrderConfirmationDialogProps) {
  if (!orderData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: '2rem' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            訂單已送出
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            您的訂單已成功送出，我們會盡快為您準備！
          </Typography>

          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              本次加點詳情：
            </Typography>
            {orderData.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  {item.dish.品名} x {item.quantity}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                  NT$ {item.dish.價格TWD * item.quantity}
                </Typography>
              </Box>
            ))}
            
            {/* 显示已确认订单总价（如果有） */}
            {orderData.submittedItemsAmount !== undefined && orderData.submittedItemsAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已確認訂單
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  NT$ {orderData.submittedItemsAmount}
                </Typography>
              </Box>
            )}
            
            {/* 显示加點总价 */}
            {orderData.newItemsAmount !== undefined && orderData.newItemsAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
                  加點
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                  NT$ {orderData.newItemsAmount}
                </Typography>
              </Box>
            )}
            
            {/* 总总计 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                總計
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                NT$ {orderData.totalAmount}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              📧 訂單資訊已發送至後台系統
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

