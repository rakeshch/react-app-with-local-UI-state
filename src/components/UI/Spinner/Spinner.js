import React from 'react';

import classes from './Spinner.module.css';

//picking a css spinner
//https://projects.lukehaas.me/css-loaders/
const spinner=(props)=>(
    <div className={classes.Loader}>Loading...</div>
);

export default spinner;