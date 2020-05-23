import React from 'react';
import { shallow } from 'enzyme';
import { TrashCan } from './TrashCan';

describe('TrashCan', () => {
  it('renders visually', () => {
    const wrapper = shallow(
      <TrashCan
        uri="/my/uri"
        description="a test"
        acknowledgeDelete={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('a successful response', () => {
    let acknowledgeDelete = jest.fn();

    beforeEach(() => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({ ok: true }));
      const wrapper = shallow(
        <TrashCan
          uri="/my/uri"
          description="a test"
          acknowledgeDelete={acknowledgeDelete}
        />
      );
      wrapper.find('svg').simulate('click');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an info acknowledgement', () => {
      expect(acknowledgeDelete).toBeCalledTimes(1);
      expect(acknowledgeDelete).toBeCalledWith(
        'info',
        "successfully deleted 'a test'"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/uri', { method: 'DELETE' });
    });
  });

  describe('an unsuccessful response', () => {
    let acknowledgeDelete = jest.fn();

    beforeEach(() => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.resolve({ status: '666' }));
      const wrapper = shallow(
        <TrashCan
          uri="/my/uri"
          description="a test"
          acknowledgeDelete={acknowledgeDelete}
        />
      );
      wrapper.find('svg').simulate('click');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an error acknowledgement', () => {
      expect(acknowledgeDelete).toBeCalledTimes(1);
      expect(acknowledgeDelete).toBeCalledWith(
        'error',
        "code 666 deleting 'a test'"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/uri', { method: 'DELETE' });
    });
  });

  describe('an exception', () => {
    let acknowledgeDelete = jest.fn();

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('a message');
      });
      const wrapper = shallow(
        <TrashCan
          uri="/my/uri"
          description="a test"
          acknowledgeDelete={acknowledgeDelete}
        />
      );
      wrapper.find('svg').simulate('click');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an error acknowledgement', () => {
      expect(acknowledgeDelete).toBeCalledTimes(1);
      expect(acknowledgeDelete).toBeCalledWith(
        'error',
        "exception 'a message' deleting 'a test'"
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/uri', { method: 'DELETE' });
    });
  });
});
