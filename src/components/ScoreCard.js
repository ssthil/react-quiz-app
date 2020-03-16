import React from 'react';
import { Typography } from '@material-ui/core';

export const ScoreCard = ({ score, randomQuestions }) => (
  <div className="scoreContainer">
    <Typography variant="subtitle1">Your score is</Typography>
    <Typography variant="h3">
      {score}/{randomQuestions.length}
    </Typography>
  </div>
);
