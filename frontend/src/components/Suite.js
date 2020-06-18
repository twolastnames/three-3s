import React from 'react';
import PropTypes from 'prop-types';

Suite.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  extras: PropTypes.array,
};

export function Suite({ id, name, extras }) {
  let reactKey = 2;
  const extension = (extras || []).map((extra) => (
    <li key={reactKey++}>{extra}</li>
  ));
  return (
    <div>
      <ul className='record'>
        {extension}
        <li key="1">
          <a href={`/architect/suites/${id}`}>{name}</a>
        </li>
      </ul>
    </div>
  );
}
