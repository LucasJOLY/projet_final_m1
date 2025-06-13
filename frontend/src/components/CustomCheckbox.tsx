import React from 'react';
import { styled } from '@mui/material/styles';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const CheckboxContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const CheckboxInput = styled('input')({
  appearance: 'none',
  width: '20px',
  height: '20px',
  border: '1px solid #E0E0E0',
  borderRadius: '4px',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  '&:checked': {
    backgroundColor: '#4880FF',
    borderColor: '#4880FF',
  },
  '&:checked::after': {
    content: '""',
    position: 'absolute',
    left: '6px',
    top: '2px',
    width: '5px',
    height: '10px',
    border: 'solid white',
    borderWidth: '0 2px 2px 0',
    transform: 'rotate(45deg)',
  },
  '&:hover': {
    borderColor: '#4880FF',
  },
});

const Label = styled('label')({
  color: '#666666',
  fontFamily: 'Nunito',
  fontSize: '14px',
  cursor: 'pointer',
  userSelect: 'none',
});

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <CheckboxContainer>
      <CheckboxInput
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
};

export default CustomCheckbox;
