import React from 'react';
import PropTypes from 'prop-types';

import { fetchWithMessages } from '../helpers/fetchWithMessages';

const patch = fetchWithMessages({ method: 'PATCH' });

const d =
  'M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 ' +
  '5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992zM11 ' +
  '11V8h2v3h3v2h-3v3h-2v-3H8v-2h3z';

const AddSvg = ({ onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d={d} />
  </svg>
);

AddSvg.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const doAdd = (url, description, triggerUpdate) => async () => {
  await patch(description, url);
  triggerUpdate();
};

export function AddIcon({ url, description, triggerUpdate = () => {} }) {
  return AddSvg({ onClick: doAdd(url, description, triggerUpdate) });
}

AddIcon.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  triggerUpdate: PropTypes.func,
};
