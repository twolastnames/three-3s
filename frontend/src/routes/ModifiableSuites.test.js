import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { ModifiableSuites } from './ModifiableSuites';

describe('ModifiableSuites', () => {
  describe('an exception', () => {
    let displayMessage;
    let wrapper;

    beforeAll(async () => {
      displayMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('error message');
      });
      wrapper = mount(<ModifiableSuites displayMessage={displayMessage} />);
      await act(() => nextTick());
    });

    afterAll(() => {
      global.fetch.mockReset();
    });

    it('has text for no suites', async () => {
      await nextTick();
      expect(wrapper.text()).toEqual('Modifiable SuitesLoading...');
    });

    it('gives a message', () => {
      expect(displayMessage).toBeCalledTimes(1);
      expect(displayMessage).toBeCalledWith(
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
    let displayMessage;
    let wrapper;

    beforeAll(async () => {
      displayMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          status: 400,
        })
      );
      wrapper = mount(
        <ModifiableSuites key="1" displayMessage={displayMessage} />
      );
      await act(() => nextTick());
    });

    afterAll(() => {
      global.fetch.mockReset();
    });

    it('has text for no suites', async () => {
      await act(async () => await nextTick());
      expect(wrapper.text()).toEqual('Modifiable SuitesLoading...');
    });

    it('gives a message', () => {
      expect(displayMessage).toBeCalledTimes(1);
      expect(displayMessage).toBeCalledWith(
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
    let displayMessage;
    let wrapper;

    beforeAll(async () => {
      displayMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              records: [{ id: 5, name: 'my data' }],
            }),
        })
      );
      wrapper = mount(
        <ModifiableSuites key="1" displayMessage={displayMessage} />
      );
      await act(() => nextTick());
    });

    afterAll(() => {
      global.fetch.mockReset();
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
      expect(displayMessage).toBeCalledTimes(0);
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/threAS3/suites', {});
    });
  });
});
