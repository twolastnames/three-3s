import React from 'react';
import { shallow } from 'enzyme';
import { Header } from './Header';

describe('Message', () => {
  it('renders visually', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
  });
});
