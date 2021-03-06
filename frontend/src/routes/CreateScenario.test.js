import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import { CreateScenario } from './CreateScenario';

describe('CreateScenario', () => {
  it('renders visually', () => {
    expect(shallow(<CreateScenario />)).toMatchSnapshot();
  });

  describe('a successful response', () => {
    beforeEach(async () => {
      window.displayMessage.mockReset();
      withFetch().mockOk('data');
      const wrapper = mount(<CreateScenario />);
      act(() =>
        wrapper.find('input').prop('onChange')({ target: { value: 'hello' } })
      );
      await nextTick();
      wrapper.find('button').simulate('click', { preventDefault: () => {} });
      await nextTick();
    });

    it('gives an info acknowledgement', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'info',
        "success with scenario named 'undefined'"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/scenarios?name=undefined', {
        method: 'POST',
      });
    });
  });

  describe('an unsuccessful response', () => {
    beforeEach(async () => {
      window.displayMessage.mockReset();
      withFetch().mockNotOk(666);
      const wrapper = mount(<CreateScenario />);
      act(() =>
        wrapper.find('input').prop('onChange')({ target: { value: 'hello' } })
      );
      await nextTick();
      wrapper.find('button').simulate('click', { preventDefault: () => {} });
      await nextTick();
    });

    it('gives an error acknowledgement', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        "scenario named 'undefined' with HTTP code 666"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/scenarios?name=undefined', {
        method: 'POST',
      });
    });
  });

  describe('an exception', () => {
    beforeEach(async () => {
      window.displayMessage.mockReset();
      withFetch().mockException('a message');
      const wrapper = mount(<CreateScenario />);
      act(() =>
        wrapper.find('input').prop('onChange')({ target: { value: 'hello' } })
      );
      await nextTick();
      wrapper.find('button').simulate('click', { preventDefault: () => {} });
      await nextTick();
    });

    it('gives an error acknowledgement', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        "scenario named 'undefined' a message"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/scenarios?name=undefined', {
        method: 'POST',
      });
    });
  });
});
