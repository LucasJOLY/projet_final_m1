import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { getPercentageIcon, getPercentageColor } from '../utils';
import type { CardData } from '../types';
import { useIntl } from 'react-intl';

interface DashboardCardProps {
  data: CardData;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ data }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const intl = useIntl();
  const cardBgColor = isDarkMode ? '#273142' : '#ffffff';
  const titleColor = isDarkMode ? '#bec1c5' : '#636466';
  const contentColor = isDarkMode ? '#ffffff' : '#000000';
  const additionalInfoColor = isDarkMode ? '#ffffff' : '#737373';

  return (
    <Box
      sx={{
        backgroundColor: cardBgColor,
        borderRadius: '8px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'relative',
        boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: isDarkMode ? '1px solid #3a4553' : 'none',
      }}
    >
      {/* En-tête avec icône et titre */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Typography
          variant='body2'
          sx={{
            color: titleColor,
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {data.title}
        </Typography>

        {/* Conteneur de l'icône */}
        <Box
          sx={{
            width: '70px',
            height: '70px',
            borderRadius: '10px',
            backgroundColor: `${data.backgroundColor}20`, // 20% d'opacité
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: data.iconColor,
            fontSize: '30px',
          }}
        >
          {data.icon}
        </Box>
      </Box>

      {/* Valeur principale */}
      <Typography
        variant='h4'
        sx={{
          color: contentColor,
          fontWeight: 'bold',
          fontSize: '28px',
          lineHeight: 1.2,
        }}
      >
        {data.value}
      </Typography>

      {/* Information supplémentaire (pourcentage, etc.) */}
      {data.additionalInfo && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {data.isPositive !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: getPercentageColor(data.isPositive ? 1 : -1),
                fontSize: '16px',
              }}
            >
              {getPercentageIcon(data.isPositive ? 1 : -1)}
            </Box>
          )}
          <Typography
            variant='body2'
            sx={{
              color:
                data.isPositive !== undefined
                  ? getPercentageColor(data.isPositive ? 1 : -1)
                  : additionalInfoColor,
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            {data.additionalInfo} {intl.formatMessage({ id: 'dashboard.comparison.lastYear' })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DashboardCard;
