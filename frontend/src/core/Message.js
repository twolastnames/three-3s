import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const errorD =
  'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 ' +
  '10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0' +
  '-8h2v6h-2V7z';

const warnD =
  'M12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 ' +
  '1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0zm-8.66 16h15.588L12 5.5 4.206 ' +
  '19zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z';

const infoD =
  'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 ' +
  '10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 ' +
  '11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z';

const closeD =
  'M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 ' +
  '1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z';

const icons = {
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <title>Error Message</title>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d={errorD} />
    </svg>
  ),
  warn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <title>Warning Message</title>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d={warnD} />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <title>Information Message</title>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d={infoD} />
    </svg>
  ),
};

const close = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <title>Close Message</title>
    <path fill="none" d="M0 0h24v24H0z" />
    <path d={closeD} />
  </svg>
);

Message.propTypes = {
  level: (props, propName, componentName) => {
    if (['info', 'warn', 'error'].includes(props[propName])) {
      return;
    }
    return new Error(
      `Prop ${propName} expected to be one of info, warn, or error`
    );
  },
  message: PropTypes.string.isRequired,
};

export function Message({ level, message }) {
  const [opacity, setOpacity] = useState(1.0);
  const [display, setDisplay] = useState(null);
  const startFade = 10000;

  function closeMessage() {
    setDisplay('none');
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  }

  let timeoutId = null;
  let intervalId = null;
  function fadeOut() {
    let localOpacity = 1.0;
    intervalId = setInterval(() => {
      if (localOpacity > 0.0) {
        localOpacity -= 0.1;
        setOpacity(localOpacity);
      } else {
        closeMessage();
      }
    }, 250);
  }

  useEffect(() => {
    // eslint-disable-next-line
    timeoutId = setTimeout(fadeOut, startFade)
  }, []);

  return (
    <li className="message" style={{ opacity, display }}>
      <div className="level" style={{ opacity }}>
        {icons[level]}
      </div>
      <div className="close" onClick={closeMessage} style={{ opacity }}>
        {close}
      </div>
      <div className="text" style={{ opacity }}>
        {message}
      </div>
    </li>
  );
}
