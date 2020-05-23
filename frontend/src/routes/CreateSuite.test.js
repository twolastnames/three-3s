import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import { CreateSuite } from './CreateSuite';

describe('CreateSuite', () => {
  it('renders visually', () => {
    expect(
      shallow(<CreateSuite displayMessage={() => {}} />)
    ).toMatchSnapshot();
  });

  describe('a successful response', () => {
    let displayMessage = jest.fn();

    beforeEach(async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: async () => {
            'data';
          },
        })
      );
      const wrapper = mount(<CreateSuite displayMessage={displayMessage} />);
      act(() =>
        wrapper.find('input').prop('onChange')({ target: { value: 'hello' } })
      );
      await nextTick();
      wrapper.find('button').simulate('click', { preventDefault: () => {} });
      await nextTick();
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an info acknowledgement', () => {
      expect(displayMessage).toBeCalledTimes(1);
      expect(displayMessage).toBeCalledWith(
        'info',
        "success with suite named 'undefined'"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites?name=undefined', {
        method: 'POST',
      });
    });
  });

  describe('an unsuccessful response', () => {
    let displayMessage = jest.fn();

    beforeEach(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({ status: 666 }));
      const wrapper = mount(<CreateSuite displayMessage={displayMessage} />);
      act(() =>
        wrapper.find('input').prop('onChange')({ target: { value: 'hello' } })
      );
      await nextTick();
      wrapper.find('button').simulate('click', { preventDefault: () => {} });
      await nextTick();
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an error acknowledgement', () => {
      expect(displayMessage).toBeCalledTimes(1);
      expect(displayMessage).toBeCalledWith(
        'error',
        "suite named 'undefined' with HTTP code 666"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites?name=undefined', {
        method: 'POST',
      });
    });
  });

  describe('an exception', () => {
    let displayMessage = jest.fn();

    beforeEach(async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('a message');
      });
      const wrapper = mount(<CreateSuite displayMessage={displayMessage} />);
      act(() =>
        wrapper.find('input').prop('onChange')({ target: { value: 'hello' } })
      );
      await nextTick();
      wrapper.find('button').simulate('click', { preventDefault: () => {} });
      await nextTick();
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an error acknowledgement', () => {
      expect(displayMessage).toBeCalledTimes(1);
      expect(displayMessage).toBeCalledWith(
        'error',
        "suite named 'undefined' a message"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites?name=undefined', {
        method: 'POST',
      });
    });
  });
});
