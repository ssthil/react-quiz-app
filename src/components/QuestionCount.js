import React from 'react';
import { Typography } from '@material-ui/core';

export const QuestionCount = ({ selectedQuestion, randomQuestions }) => (
  <Typography variant="subtitle1" className="alignCenter">
    Question {selectedQuestion + 1} of {randomQuestions}
  </Typography>
);
