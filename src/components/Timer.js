import React from 'react';
import { Typography } from '@material-ui/core';

export const Timer = ({ seconds }) => (
  <div className="marginTopTwenty">
    <Typography
      variant="subtitle1"
      className={`alignCenter ${seconds < 10 ? 'redColor' : 'default'}`}
    >
      Time Remaining:
      <span className="boldText">
        00:{seconds >= 10 ? seconds : `0${seconds}`}
      </span>
    </Typography>
  </div>
);
