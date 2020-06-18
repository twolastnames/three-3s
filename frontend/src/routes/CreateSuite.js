import React from 'react';
import { useState } from 'react';
import { fetchWithMessages } from '../helpers/fetchWithMessages';
import PropTypes from 'prop-types';

const postWithMessages = fetchWithMessages({ method: 'POST' }, 'info');

const getInput = () => document.getElementById('create_suite_name');

const getName = () => (getInput() || {}).value;

const clearName = () => ((getInput() || {}).value = '');

const getUrl = () => `/threAS3/suites?name=${getName()}`;

const getDescription = () => `suite named '${getName()}'`;

const createSuite = async (post) => await post(getDescription(), getUrl());

const onClick = (post, setButtonDisabled) => (event) => {
  event.preventDefault();
  createSuite(post);
  clearName();
  setButtonDisabled(true);
};

const onChange = (setButtonDisabled) => ({ target: { value } }) =>
  setButtonDisabled(!value);

Input.propTypes = {
  setButtonDisabled: PropTypes.func.isRequired,
};

function Input({ setButtonDisabled }) {
  return (
    <input
      onChange={onChange(setButtonDisabled)}
      type="text"
      id="create_suite_name"
    />
  );
}

Button.propTypes = {
  buttonDisabled: PropTypes.bool.isRequired,
  post: PropTypes.func.isRequired,
  setButtonDisabled: PropTypes.func.isRequired,
};

function Button({ buttonDisabled, post, setButtonDisabled }) {
  return (
    <button
      disabled={buttonDisabled}
      onClick={onClick(post, setButtonDisabled)}
      value="Create"
    >
      Create
    </button>
  );
}

Form.propTypes = {
  buttonDisabled: PropTypes.bool.isRequired,
  post: PropTypes.func.isRequired,
  setButtonDisabled: PropTypes.func.isRequired,
};

function Form({ buttonDisabled, post, setButtonDisabled }) {
  return (
    <form>
      <label>
        Name
        <Input setButtonDisabled={setButtonDisabled} />
      </label>
      <Button
        buttonDisabled={buttonDisabled}
        post={post}
        setButtonDisabled={setButtonDisabled}
      />
    </form>
  );
}

export function CreateSuite() {
  const [buttonDisabled, setButtonDisabled] = useState(true);

  return (
    <div className='route'>
      <h2>Create Suite</h2>
      <Form
        buttonDisabled={buttonDisabled}
        post={postWithMessages}
        setButtonDisabled={setButtonDisabled}
      />
    </div>
  );
}
