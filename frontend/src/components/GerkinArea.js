import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getGerkinLines } from '../helpers/gerkin';
import { fetchWithMessages } from '../helpers/fetchWithMessages';

const patchMessage = fetchWithMessages({ method: 'PATCH' }, 'info');

GerkinArea.propTypes = {
  id: PropTypes.number.isRequired,
};

const onClick = (id, text, setInFlight) => async () => {
  const steps = (getGerkinLines(text) || '')
    .map(({ keyword, text }, index) => `add_steps[]=${keyword} ${text}`)
    .join('&');
  setInFlight(true);
  await patchMessage('save Gerkin set', `/threAS3/scenarios/${id}?${steps}`);
  setInFlight(false);
};

const onChange = (setText) => ({ target: { value } }) => setText(value);

export function GerkinArea({ id }) {
  const [text, setText] = useState('');
  const [inFlight, setInFlight] = useState(false);

  useEffect(() => {
    (async () => {
      const { records } = await fetchWithMessages()(
        'Gerkin text',
        `/threAS3/steps?with_scenario=${id}`
      );
      if (!records) {
        return;
      }
      const lines = records.map(({ keyword, text }) => `${keyword} ${text}`);
      setText(lines.join('\n'));
    })();
  }, [id, inFlight]);

  return (
    <div id="gerkin-area">
      <textarea
        onChange={onChange(setText)}
        rows="20"
        columns="60"
        value={text}
      />
      {!inFlight && getGerkinLines(text) ? (
        <button onClick={onClick(id, text, setInFlight)}>Save</button>
      ) : null}
    </div>
  );
}
