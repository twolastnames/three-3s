import React from 'react';
import { useState, useEffect } from 'react';
//import { useQuery } from 'react';
import PropTypes from 'prop-types';

import { getFetchRecord } from '../helpers/fetchWithMessages';

ModifiableScenario.propTypes = {
  match: PropTypes.object.isRequired,
};

const GerkinArea = () => (
  <div>
    <label>
      Gerkin Text
      <textarea id="gerkin-area" rows="20" columns="60" />
    </label>
  </div>
);

const getDescription = (id) => `getting scenario with ID ${id}`;

const getUrl = (id) => `/threAS3/scenarios/${id}`;

const loadScenario = async (id) =>
  await getFetchRecord(getUrl(id), getDescription(id));

export function ModifiableScenario({
  match: {
    params: { id },
  },
}) {
  const [scenario, setScenario] = useState(null);

  useEffect(() => {
    (async () => setScenario(await loadScenario(id)))();
  }, [id]);

  return (
    <div>
      <h2>Scenario: {(scenario || { name: '' }).name}</h2>
      {scenario === undefined ? 'Not Found' : ''}
      {scenario === null ? 'Loading...' : ''}
      <GerkinArea />
    </div>
  );
}

ModifiableScenario.propTypes = {
  match: PropTypes.object.isRequired,
};
