import React from 'react';

import { shallow } from 'enzyme';
import { RemoveIcon } from './RemoveIcon';

describe('RemoveIcon', () => {
  it('renders visually', () => {
    const wrapper = shallow(
      <RemoveIcon
        url="/threAS3/suites/5?remove_scenario_id=7"
        description="a test"
        acknowledgeDelete={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('a successful response', () => {
    let triggerUpdate = jest.fn();

    beforeAll(() => {
      withFetch().mockOk({});
      const wrapper = shallow(
        <RemoveIcon
          url="/my/url"
          description="a test"
          triggerUpdate={triggerUpdate}
        />
      );
      wrapper.find('svg').simulate('click');
    });

    it('gives an info acknowledgement', () => {
      expect(triggerUpdate).toBeCalledTimes(1);
      expect(triggerUpdate).toBeCalledWith();
    });

    it('is called with requested url', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'PATCH' });
    });
  });

  describe('an unsuccessful response', () => {
    let triggerUpdate = jest.fn();

    beforeAll(() => {
      withFetch().mockNotOk(666);
      const wrapper = shallow(
        <RemoveIcon
          url="/my/url"
          description="a test"
          triggerUpdate={triggerUpdate}
        />
      );
      wrapper.find('svg').simulate('click');
    });

    it('gives an error acknowledgement', () => {
      expect(triggerUpdate).toBeCalledTimes(1);
      expect(triggerUpdate).toBeCalledWith();
    });

    it('is called with requested url', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'PATCH' });
    });
  });

  describe('an exception', () => {
    let triggerUpdate = jest.fn();

    beforeAll(() => {
      withFetch().mockException('a message');
      const wrapper = shallow(
        <RemoveIcon
          url="/my/url"
          description="a test"
          triggerUpdate={triggerUpdate}
        />
      );
      wrapper.find('svg').simulate('click');
    });

    it('gives an error acknowledgement', () => {
      expect(triggerUpdate).toBeCalledTimes(1);
      expect(triggerUpdate).toBeCalledWith();
    });

    it('is called with requested url', () => {
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'PATCH' });
      expect(global.fetch).toBeCalledTimes(1);
    });
  });
});
