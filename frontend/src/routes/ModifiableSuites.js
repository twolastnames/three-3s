import React from 'react';
import { useEffect, useState } from 'react';
import { fetchWithMessages } from '../helpers/fetchWithMessages';
import { Suite } from '../components/Suite';
import { TrashCan } from '../components/TrashCan';

const getWithMessages = fetchWithMessages();

const acknowledgeDelete = (setNeedUpdate) => (
  level,
  message
) => {
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

const getSuiteComponent = (setNeedUpdate) => ({ id, name }) => {
  const trashCan = getTrashCan(setNeedUpdate, { id, name });
  return <Suite key={id} id={id} name={name} extras={[trashCan]} />;
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

const getComponent = (setNeedUpdate, suites) => (
  <div>
    <h2>Modifiable Suites</h2>
    {(suites || []).map(getSuiteComponent(setNeedUpdate))}
    {suites == null ? 'Loading...' : ''}
    {(suites || []).length ? '' : suites && 'No Created Suites'}
  </div>
);

export function ModifiableSuites() {
  const [suites, setSuites] = useState(null);
  const [needUpdate, setNeedUpdate] = useState(true);
  const getNeedUpdate = () => needUpdate;
  const getPayload = getWithMessages('error');

  useEffect(() => {
    setPayload(getPayload, getNeedUpdate, setNeedUpdate, setSuites);
    // eslint-disable-next-line
  }, [needUpdate])
  return getComponent(setNeedUpdate, suites);
}
