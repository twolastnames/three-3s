import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { ModifiableSuites } from './ModifiableSuites';

describe('ModifiableSuites', () => {
  describe('an exception', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset()
      withFetch().mockException('error message');
      wrapper = mount(<ModifiableSuites />);
      await act(() => nextTick());
    });

    it('has text for no suites', async () => {
      await nextTick();
      expect(wrapper.text()).toEqual('Modifiable SuitesLoading...');
    });

    it('gives a message', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching suites error message'
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites', {});
    });
  });

  describe('an unsuccessful response', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset()
      withFetch().mockNotOk(400);
      wrapper = mount(
        <ModifiableSuites key="1" />
      );
      await act(() => nextTick());
    });

    it('has text for no suites', async () => {
      await act(async () => await nextTick());
      expect(wrapper.text()).toEqual('Modifiable SuitesLoading...');
    });

    it('gives a message', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching suites with HTTP code 400'
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites', {});
    });
  });

  describe('a successful response', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset()
      withFetch().mockOk({
        records: [{ id: 5, name: 'my data' }],
      });
      wrapper = mount(
        <ModifiableSuites key="1" />
      );
      await act(() => nextTick());
    });

    it('has record', async () => {
      await act(async () => await nextTick());
      expect(wrapper.text()).toMatch(/my data/);
    });

    it('has record', async () => {
      await act(async () => await nextTick());
      expect(wrapper.text()).toMatch(/Modifiable Suites/);
    });

    it('has the suite name given', async () => {
      await act(async () => await nextTick());
      expect(wrapper.text()).toMatch(/my data/);
    });

    it('does not give a message', () => {
      expect(window.displayMessage).toBeCalledTimes(0);
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites', {});
    });
  });
});
