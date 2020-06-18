import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const setPane = (paneIndex, setPaneIndex) => () => setPaneIndex(paneIndex);

export function SelectablePane({ selectablePanes = [] }) {
  const [paneIndex, setPaneIndex] = useState(0);

  const panes = selectablePanes.map(({ component }) => component);

  const radioButtons = selectablePanes.map(({ title }, index) => [
    <div>
    <input
      key={`radio-input-${index}`}
      onChange={setPane(index, setPaneIndex)}
      type="radio"
      checked={index === paneIndex}
      id={`multipaginator-${index}`}
      name="pane-selection"
    />
    <label key={`radio-label-${index}`} htmlFor={`multipaginator-${index}`}>
      {title}
    </label>
    </div>
  ]);

  return (
    <div>
      <div className='pane-selector'>{radioButtons}</div>
      {panes[paneIndex]}
    </div>
  );
}

SelectablePane.propTypes = {
  selectablePanes: PropTypes.array.isRequired,
};
