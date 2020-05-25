import React from 'react';
import { shallow } from 'enzyme';
import { Suite } from './Suite';

describe('Suite', () => {
  describe('its rendering', () => {
    it('renders without extras', () => {
      const wrapper = shallow(<Suite key="1" name="my suite" />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders with an extra', () => {
      const wrapper = shallow(
        <Suite key="1" name="my suite" extra={[<p key="2">An extra</p>]} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('renders with extras', () => {
      const wrapper = shallow(
        <Suite
          key="1"
          name="my suite"
          extra={[
            <p key="1">An extra 1</p>,
            <p key="2">An extra 2</p>,
            <p key="3">An extra 3</p>,
          ]}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
