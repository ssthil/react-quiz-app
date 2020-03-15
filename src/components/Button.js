// @ts-nocheck
import { Button } from '@material-ui/core';
import React from 'react';

export const ActionButton = ({ onClick, color, disabled, text }) => (
  <Button
    variant="contained"
    color={color}
    className="buttonWidth"
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </Button>
);
