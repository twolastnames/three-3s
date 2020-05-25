import React from 'react';
import PropTypes from 'prop-types';

Suite.propTypes = {
  name: PropTypes.string.isRequired,
  extras: PropTypes.array,
};

export function Suite({ name, extras }) {
  let reactKey = 2;
  const extension = (extras || []).map((extra) => (
    <li key={reactKey++}>{extra}</li>
  ));
  return (
    <div>
      <ul>
        <li key="1">
          <a href={`/architect/suites/{id}`}>{name}</a>
        </li>
        {extension}
      </ul>
    </div>
  );
}
