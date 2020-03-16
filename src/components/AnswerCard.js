import React from 'react';
import { Typography } from '@material-ui/core';

export const AnswerCard = ({ myAnswer, className }) => (
  <Typography variant="subtitle1" className={className}>
    {myAnswer}
  </Typography>
);
