import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import { ModifiableSuite } from './ModifiableSuite';

describe('ModifiableSuite', () => {
  it('can render an initial state', async () => {
    const wrapper = shallow(<ModifiableSuite match={{ params: { id: 5 } }} />);
    expect(wrapper.text()).toMatch(/Loading\.\.\./);
  });

  describe('an invalid id', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetcher = withFetch();
      fetcher.mockNotOk(404);
      fetcher.mockNotOk(404);
      wrapper = mount(<ModifiableSuite match={{ params: { id: 5 } }} />);
      await act(() => nextTick());
    });

    it('got called with correct url', () => {
      expect(global.fetch).toBeCalledWith('/threAS3/suites/5', {
        method: 'GET',
      });
      expect(global.fetch).toBeCalledWith(
        '/threAS3/scenarios?with_suite_id=5&offset=0&limit=50',
        {}
      );
      expect(global.fetch).toBeCalledTimes(2);
    });

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/);
    });

    it('specfices an error', () => {
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'loading suite ID 5 with HTTP code 404'
      );
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching scenarios for suite with id 5 with HTTP code 404'
      );
      expect(window.displayMessage).toBeCalledTimes(2);
    });
  });

  describe('an exception', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetcher = withFetch();
      fetcher.mockException('an error message');
      fetcher.mockException('an error message');
      wrapper = mount(<ModifiableSuite match={{ params: { id: 6 } }} />);
      await act(() => nextTick());
    });

    it('got called with correct url', () => {
      expect(global.fetch).toBeCalledWith('/threAS3/suites/6', {
        method: 'GET',
      });
      expect(global.fetch).toBeCalledWith(
        '/threAS3/scenarios?with_suite_id=6&offset=0&limit=50',
        {}
      );
      expect(global.fetch).toBeCalledTimes(2);
    });

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/);
    });

    it('specfices an error', () => {
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'loading suite ID 6 an error message'
      );
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching scenarios for suite with id 6 an error message'
      );
      expect(window.displayMessage).toBeCalledTimes(2);
    });
  });

  describe('a valid response', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetcher = withFetch();
      fetcher.mockOk({
        count: 1,
        records: [
          {
            name: 'scenario name',
            id: 7,
          },
        ],
      });
      fetcher.mockOk({
        record: {
          name: 'suite name',
          id: 7,
        },
      });
      wrapper = mount(<ModifiableSuite match={{ params: { id: 7 } }} />);
      await act(() => nextTick());
    });

    it('got called with correct url', async () => {
      await act(() => nextTick());
      expect(global.fetch).toBeCalledWith('/threAS3/suites/7', {
        method: 'GET',
      });
      expect(global.fetch).toBeCalledWith(
        '/threAS3/scenarios?with_suite_id=7&offset=0&limit=50',
        {}
      );
      expect(global.fetch).toBeCalledTimes(2);
    });

    it('displays the suite name', async () => {
      await act(() => nextTick());
      expect(wrapper.text()).toMatch(/suite name/);
    });

    it('does not display a message', () => {
      expect(window.displayMessage).toBeCalledTimes(0);
    });
  });
});
