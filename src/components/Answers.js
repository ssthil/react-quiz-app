import React from 'react';
import { Button } from '@material-ui/core';

export const Answers = ({ item, onClick, className, disabled }) => (
  <Button
    variant="outlined"
    size="medium"
    color="default"
    onClick={onClick}
    className={className}
    disabled={disabled}
  >
    {item}
  </Button>
);
