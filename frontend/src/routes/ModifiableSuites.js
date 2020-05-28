import React from 'react';
import PropTypes from 'prop-types';
import { Suite } from '../components/Suite';
import { TrashCan } from '../components/TrashCan';
import { PaginatedPane } from '../components/PaginatedPane';

const acknowledgeDelete = (setNeedUpdate) => (level, message) => {
  window.displayMessage(level, message);
  setNeedUpdate(true);
};

const getTrashCan = (setNeedUpdate, { id, name }) => {
  const uri = `/threAS3/suites/${id}`;
  return (
    <TrashCan
      key={id}
      uri={uri}
      acknowledgeDelete={acknowledgeDelete(setNeedUpdate)}
      description={`a suite named '${name}'`}
    />
  );
};

const getSuiteComponent = ({ id, name }, setNeedUpdate) => {
  const trashCan = getTrashCan(setNeedUpdate, { id, name });
  return <Suite key={id} id={id} name={name} extras={[trashCan]} />;
};

getSuiteComponent.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export function ModifiableSuites() {
  return (
    <div>
      <h2>Suites</h2>
      <PaginatedPane
        getComponent={getSuiteComponent}
        description="Suites"
        url="/threAS3/suites"
      />
    </div>
  );
}
