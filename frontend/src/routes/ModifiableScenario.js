import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getFetchRecord } from '../helpers/fetchWithMessages';
import { SelectablePane } from '../components/SelectablePane'
import { PaginatedPane } from '../components/PaginatedPane'
import { RemoveIcon } from '../components/RemoveIcon'
import { AddIcon } from '../components/AddIcon'

ModifiableScenario.propTypes = {
  match: PropTypes.object.isRequired,
};

const GerkinArea = () => (
  <div>
    <label forHtml="gerkin-area">
      Gerkin Text
    </label>
      <textarea id="gerkin-area" rows="20" columns="60" />
  </div>
);

const getDescription = (id) => `getting scenario with ID ${id}`;

const getUrl = (id) => `/threAS3/scenarios/${id}`;

const loadScenario = async (id) =>
  await getFetchRecord(getUrl(id), getDescription(id));

const getAddSuite = (scenarioId) => ({ id, name }, triggerUpdate) => (
  <ul>
    <li>
      <a href={`/architect/suites/${id}`}>{name}</a>
    </li>
    <li>
      <AddIcon
        url={`/threAS3/suites/${id}?add_scenario_id=${scenarioId}`}
        description={`add '${name}' suite from scenario`}
        triggerUpdate={triggerUpdate}
      />
    </li>
  </ul>
);

const getRemoveSuite = (scenarioId) => ({ id, name }, triggerUpdate) => (
  <ul>
    <li>
      <a href={`/architect/suites/${id}`}>{name}</a>
    </li>
    <li>
      <RemoveIcon
        url={`/threAS3/suites/${id}?remove_scenario_id=${scenarioId}`}
        description={`remove '${name}' suite from scenario`}
        triggerUpdate={triggerUpdate}
      />
    </li>
  </ul>
);

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
      <SelectablePane
        selectablePanes={[
          {
            title: 'Suites In',
            component: <PaginatedPane
              url={`/threAS3/suites?with_scenario_id=${id}`}
              description={`suites for scenario with id ${id}`}
              getComponent={getRemoveSuite(id)}
            />
          },
          {
            title: 'Suites Not In',
            component: <PaginatedPane
              url={`/threAS3/scenarios?without_scenario_id=${id}`}
              description={`suites without scenario with id ${id}`}
              getComponent={getAddSuite(id)}
            />
          },
          {
            title: 'Gerkin',
            component: <GerkinArea />
          },
        ]}
      />
    </div>
  );
}

ModifiableScenario.propTypes = {
  match: PropTypes.object.isRequired,
};
