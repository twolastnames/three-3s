import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { ModifiableScenario } from './ModifiableScenario';

describe('ModifiableScenario', () => {
  describe('an invalid id', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetcher = withFetch();
      fetcher.mockNotOk(404);
      fetcher.mockNotOk(404);
      wrapper = mount(<ModifiableScenario match={{ params: { id: '6' } }} />);
      await act(() => nextTick());
    });

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/);
    });

    it('specfices an error', () => {
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'getting scenario with ID 6 with HTTP code 404'
      );
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching suites for scenario with id 6 with HTTP code 404'
      );
      expect(window.displayMessage).toBeCalledTimes(2);
    });
  });

  describe('an exception', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetcher = withFetch();
      fetcher.mockException('my error');
      fetcher.mockException('my error');
      wrapper = mount(<ModifiableScenario match={{ params: { id: '6' } }} />);
      await act(() => nextTick());
    });

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/);
    });

    it('specfices an error', () => {
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching suites for scenario with id 6 my error'
      );
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'getting scenario with ID 6 my error'
      );
      expect(window.displayMessage).toBeCalledTimes(2);
    });
  });

  describe('ok responses', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetcher = withFetch();
      fetcher.mockOk({ record: {} });
      fetcher.mockOk({ records: [] });
      wrapper = mount(<ModifiableScenario match={{ params: { id: '6' } }} />);
      await act(() => nextTick());
    });

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/);
    });

    it('does not have an error', () => {
      expect(window.displayMessage).toBeCalledTimes(0);
    });
  });
});
