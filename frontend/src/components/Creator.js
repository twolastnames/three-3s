import React from 'react';
import { useState } from 'react';
import { fetchWithMessages } from '../helpers/fetchWithMessages';
import PropTypes from 'prop-types';

const postWithMessages = fetchWithMessages({ method: 'POST' }, 'info');

const getInput = () => document.getElementById('create_with_name');

const getName = () => (getInput() || {}).value;

const clearName = () => ((getInput() || {}).value = '');

const getUrl = (creatable) => `/threAS3/${creatable}s?name=${getName()}`;

const getDescription = (creatable) => `${creatable} named '${getName()}'`;

const create = async (creatable, post) => await post(getDescription(creatable), getUrl(creatable));

const onClick = (creatable, post, setButtonDisabled) => (event) => {
  event.preventDefault();
  create(creatable, post);
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
      id="create_with_name"
    />
  );
}

Button.propTypes = {
  buttonDisabled: PropTypes.bool.isRequired,
  post: PropTypes.func.isRequired,
  setButtonDisabled: PropTypes.func.isRequired,
};

function Button({ creatable, buttonDisabled, post, setButtonDisabled }) {
  return (
    <button
      disabled={buttonDisabled}
      onClick={onClick(creatable, post, setButtonDisabled)}
      value="Create"
    >
      Create
    </button>
  );
}

Form.propTypes = {
  creatable: PropTypes.string.isRequired,
  buttonDisabled: PropTypes.bool.isRequired,
  post: PropTypes.func.isRequired,
  setButtonDisabled: PropTypes.func.isRequired,
};

function Form({ creatable, buttonDisabled, post, setButtonDisabled }) {
  return (
    <form>
      <label>
        Name
        <Input setButtonDisabled={setButtonDisabled} />
      </label>
      <Button
        creatable={creatable}
        buttonDisabled={buttonDisabled}
        post={post}
        setButtonDisabled={setButtonDisabled}
      />
    </form>
  );
}

Creator.propTypes = {
  creatable: PropTypes.string.isRequired,
};

export function Creator({creatable}) {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const titleized = creatable[0].toUpperCase() + creatable.slice(1)

  return (
    <div className='route'>
      <h2>Create {titleized}</h2>
      <Form
        creatable={creatable}
        buttonDisabled={buttonDisabled}
        post={postWithMessages}
        setButtonDisabled={setButtonDisabled}
      />
    </div>
  );
}
