import { useState, useRef, useEffect } from 'react';
import { Box, Button, Divider, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Category } from '../utils/dishData';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryBar({ categories, selectedCategory, onCategorySelect }: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // 滚动到选中的类别
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedButton = scrollContainerRef.current.querySelector(
        `[data-category="${selectedCategory}"]`
      ) as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategory]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {showLeftArrow && (
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: 0,
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          px: showLeftArrow || showRightArrow ? 4 : 0,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {categories.map((category, index) => (
          <Box key={category.name} sx={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <Divider orientation="vertical" flexItem sx={{ height: '40px', mx: 0.5 }} />
            )}
            <Button
              data-category={category.name}
              variant={selectedCategory === category.name ? 'contained' : 'text'}
              onClick={() => onCategorySelect(category.name)}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1.5,
                borderRadius: 0,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: selectedCategory === category.name ? 600 : 400,
                color: selectedCategory === category.name ? 'primary.contrastText' : 'text.primary',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: selectedCategory === category.name ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              {category.displayName}
            </Button>
          </Box>
        ))}
      </Box>

      {showRightArrow && (
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
