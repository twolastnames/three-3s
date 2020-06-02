// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { promisify } from 'util';

import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });

global.nextTick = promisify(process.nextTick);

global.fetch = jest.fn();

const fetchMocks = {
  mockException: (message) =>
    global.fetch.mockImplementationOnce(() => {
      throw new Error(message);
    }),
  mockNotOk: (status) =>
    global.fetch.mockImplementationOnce(() => Promise.resolve({ status })),
  mockOk: (payload) =>
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(payload),
      })
    ),
};

global.withFetch = () => {
  global.fetch.mockReset();
  return fetchMocks;
};

global.window.displayMessage = jest.fn();
