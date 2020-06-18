import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { PaginatedPane } from '../components/PaginatedPane';
import { SelectablePane } from '../components/SelectablePane';
import { RemoveIcon } from '../components/RemoveIcon';
import { AddIcon } from '../components/AddIcon';

import { getFetchRecord } from '../helpers/fetchWithMessages';

const getDescription = (id) => `loading suite ID ${id}`;

const getGetUrl = (id) => `/threAS3/suites/${id}`;

const fetchSuite = async (id) =>
  await getFetchRecord(getGetUrl(id), getDescription(id));

const getAddScenario = (suiteId) => ({ id, name }, triggerUpdate) => (
  <ul className='record'>
    <li>
      <AddIcon
        url={`/threAS3/scenarios/${id}?add_suite_id=${suiteId}`}
        description={`add '${name}' scenario from suite`}
        triggerUpdate={triggerUpdate}
      />
    </li>
    <li>
      <a href={`/architect/scenarios/${id}`}>{name}</a>
    </li>
  </ul>
);

const getRemoveScenario = (suiteId) => ({ id, name }, triggerUpdate) => (
  <ul className='record'>
    <li>
      <RemoveIcon
        url={`/threAS3/scenarios/${id}?remove_suite_id=${suiteId}`}
        description={`remove '${name}' scenario from suite`}
        triggerUpdate={triggerUpdate}
      />
    </li>
    <li>
      <a href={`/architect/scenarios/${id}`}>{name}</a>
    </li>
  </ul>
);

export function ModifiableSuite({
  match: {
    params: { id },
  },
}) {
  const [suite, setSuite] = useState(null);

  useEffect(() => {
    (async () => setSuite(await fetchSuite(id)))();
  }, [id]);

  return (
    <div className='route'>
      <h2>Suite: {(suite || { name: '' }).name}</h2>
      {suite === undefined ? 'Not Found' : ''}
      {suite === null ? 'Loading...' : ''}
      <SelectablePane
        selectablePanes={[
          {
            title: 'Scenarios in Suite',
            component: (
              <PaginatedPane
                url={`/threAS3/scenarios?with_suite_id=${id}`}
                description={`scenarios for suite with id ${id}`}
                getComponent={getRemoveScenario(id)}
              />
            ),
          },
          {
            title: 'Scenarios not in Suite',
            component: (
              <PaginatedPane
                url={`/threAS3/scenarios?without_suite_id=${id}`}
                description={`scenarios without suite with id ${id}`}
                getComponent={getAddScenario(id)}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

ModifiableSuite.propTypes = {
  match: PropTypes.object.isRequired,
};
