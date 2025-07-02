import React, { useState } from 'react';
import {
  TextField,
  Box,
  LinearProgress,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { calculatePasswordStrength } from '../auth/service';
import type { PasswordStrength } from '../auth/types';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: boolean;
  helperText?: string;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  showScore?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  name,
  onBlur,
  showScore = true,
}) => {
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const strength: PasswordStrength = calculatePasswordStrength(value || '');

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        type={showPassword ? 'text' : 'password'}
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        name={name}
        onBlur={(e) => {
          setTouched(true);
          onBlur && onBlur(e);
        }}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                onClick={() => setShowPassword((prev) => !prev)}
                edge='end'
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {touched && value && showScore && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant='determinate'
            value={strength.score}
            sx={{
              height: 8,
              borderRadius: 4,
              background: '#eee',
              '& .MuiLinearProgress-bar': { backgroundColor: strength.color },
            }}
          />
          <Typography variant='caption' sx={{ color: strength.color, fontWeight: 600, mt: 0.5 }}>
            {strength.label === 'weak' ? 'Faible' : strength.label === 'medium' ? 'Moyen' : 'Fort'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PasswordField;
