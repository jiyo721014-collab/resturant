import { Box, Typography, Paper } from '@mui/material';
import { getComboMeals } from '../utils/dishData';

interface ComboListProps {
  selectedCombo: string | null;
  onComboSelect: (comboId: string) => void;
}

export default function ComboList({ selectedCombo, onComboSelect }: ComboListProps) {
  const combos = getComboMeals();

  return (
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
      {combos.map((combo) => (
        <Paper
          key={combo.id}
          elevation={selectedCombo === combo.id ? 4 : 1}
          onClick={() => onComboSelect(combo.id)}
          sx={{
            p: 3,
            mb: 2,
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: selectedCombo === combo.id ? '2px solid' : '2px solid transparent',
            borderColor: selectedCombo === combo.id ? 'primary.main' : 'transparent',
            bgcolor: selectedCombo === combo.id ? 'action.selected' : 'background.paper',
            '&:hover': {
              elevation: 3,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontSize: '2.5rem' }}>
              {combo.icon}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              {combo.name}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

