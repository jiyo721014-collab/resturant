import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { Dish } from '../utils/dishData';

interface QuantityDialogProps {
  open: boolean;
  dish: Dish | null;
  onClose: () => void;
  onConfirm: (dish: Dish, quantity: number) => void;
}

export default function QuantityDialog({ open, dish, onClose, onConfirm }: QuantityDialogProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleConfirm = () => {
    if (dish) {
      onConfirm(dish, quantity);
      setQuantity(1);
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  if (!dish) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {dish.品名}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          NT$ {dish.價格TWD} / 份
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              請選擇數量
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleDecrease}
                disabled={quantity <= 1}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, val));
                }}
                inputProps={{
                  min: 1,
                  style: { textAlign: 'center', fontSize: '1.2rem', fontWeight: 600 },
                }}
                sx={{
                  width: '100px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleIncrease}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                單價
              </Typography>
              <Typography variant="body2">
                NT$ {dish.價格TWD}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                數量
              </Typography>
              <Typography variant="body2">
                {quantity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                總計
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                NT$ {dish.價格TWD * quantity}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          取消
        </Button>
        <Button onClick={handleConfirm} variant="contained" sx={{ minWidth: '120px' }}>
          確認加入
        </Button>
      </DialogActions>
    </Dialog>
  );
}

