import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const setPane = (paneIndex, setPaneIndex) => () => setPaneIndex(paneIndex);

export function SelectablePane({ paginatedPanes = [] }) {
  const [paneIndex, setPaneIndex] = useState(0);

  const panes = paginatedPanes.map(({ component }) => component);

  const radioButtons = [];

  const radioInputs = paginatedPanes.map(({ title }, index) => [
    <input
      key={`radio-input-${index}`}
      onChange={setPane(index, setPaneIndex)}
      type="radio"
      checked={index === paneIndex}
      id={`multipaginator-${index}`}
      name="pane-selection"
    />,
  ]);

  const radioLabels = paginatedPanes.map(({ title }, index) => [
    <label key={`radio-label-${index}`} htmlFor={`multipaginator-${index}`}>
      {title}
    </label>,
  ]);

  for (let radioIndex = 0; radioIndex < radioLabels.length; radioIndex++) {
    radioButtons.push(radioInputs[radioIndex]);
    radioButtons.push(radioLabels[radioIndex]);
  }

  return (
    <div>
      {radioButtons}
      {panes[paneIndex]}
    </div>
  );
}

SelectablePane.propTypes = {
  paginatedPanes: PropTypes.array.isRequired,
};
