import React from 'react';

const imgUri = require('../../images/404.jpg');

function NoMatch() {
  return (
    <div>
      <img src={imgUri} alt="404" />
    </div>
  );
}

export default NoMatch;
