import React from 'react';
import { useEffect, useState } from 'react';
import { fetchWithMessages } from '../helpers/fetchWithMessages';
import { Suite } from '../components/Suite';
import { TrashCan } from '../components/TrashCan';
import PropTypes from 'prop-types';

const getWithMessages = fetchWithMessages();

const acknowledgeDelete = (displayMessage, setNeedUpdate) => (
  level,
  message
) => {
  displayMessage(level, message);
  setNeedUpdate(true);
};

const getTrashCan = (displayMessage, setNeedUpdate, { id, name }) => {
  const uri = `/threAS3/suites/${id}`;
  return (
    <TrashCan
      key={id}
      uri={uri}
      acknowledgeDelete={acknowledgeDelete(displayMessage, setNeedUpdate)}
      description={`a suite named '${name}'`}
    />
  );
};

const getSuiteComponent = (displayMessage, setNeedUpdate) => ({ id, name }) => {
  const trashCan = getTrashCan(displayMessage, setNeedUpdate, { id, name });
  return <Suite key={id} name={name} extras={[trashCan]} />;
};

const setPayload = async (
  getPayload,
  getNeedUpdate,
  setNeedUpdate,
  setSuites
) => {
  if (!getNeedUpdate()) {
    return;
  }
  setNeedUpdate(false);
  const { records } = await getPayload('fetching suites', '/threAS3/suites');
  setSuites(records);
};

const getComponent = (displayMessage, setNeedUpdate, suites) => (
  <div>
    <h2>Modifiable Suites</h2>
    {(suites || []).map(getSuiteComponent(displayMessage, setNeedUpdate))}
    {suites == null ? 'Loading...' : ''}
    {(suites || []).length ? '' : (suites && 'No Created Suites')}
  </div>
);

ModifiableSuites.propTypes = {
  displayMessage: PropTypes.func.isRequired,
};

export function ModifiableSuites({ displayMessage }) {
  const [suites, setSuites] = useState(null);
  const [needUpdate, setNeedUpdate] = useState(true);
  const getNeedUpdate = () => needUpdate;
  const getPayload = getWithMessages(displayMessage);

  useEffect(() => {
    setPayload(getPayload, getNeedUpdate, setNeedUpdate, setSuites);
    // eslint-disable-next-line
  }, [needUpdate])

  return getComponent(displayMessage, setNeedUpdate, suites);
}
