import React from 'react';
import { shallow } from 'enzyme';
import { Architect } from './Architect';

describe('Architect', () => {
  it('renders visually', () => {
    const wrapper = shallow(<Architect />);
    expect(wrapper).toMatchSnapshot();
  });
});
