import React from 'react';
import { render, act } from '@testing-library/react';
import { shallow } from 'enzyme';
import { Message } from './Message';

jest.useFakeTimers();

describe('Message', () => {
  describe('an error message', () => {
    const wrapper = shallow(<Message level="error" message="say error" />);

    it('has error icon', () => {
      expect(wrapper.find('.level').html()).toMatchSnapshot();
    });

    it('has close button', () => {
      expect(wrapper.find('.close').html()).toMatchSnapshot();
    });

    it('has text', () => {
      expect(wrapper.find('.text').text()).toEqual('say error');
    });
  });

  describe('an info message', () => {
    const wrapper = shallow(<Message level="info" message="say info" />);

    it('has info icon', () => {
      expect(wrapper.find('.level').html()).toMatchSnapshot();
    });

    it('has close button', () => {
      expect(wrapper.find('.close').html()).toMatchSnapshot();
    });

    it('has text', () => {
      expect(wrapper.find('.text').text()).toEqual('say info');
    });
  });

  describe('a warning message', () => {
    const wrapper = shallow(<Message level="warn" message="say warn" />);

    it('has warning icon', () => {
      expect(wrapper.find('.level').html()).toMatchSnapshot();
    });

    it('has close button', () => {
      expect(wrapper.find('.close').html()).toMatchSnapshot();
    });

    it('has text', () => {
      expect(wrapper.find('.text').text()).toEqual('say warn');
    });
  });

  test('its disapperance', () => {
    const { getByText } = render(<Message level="info" message="say info" />);
    expect(getByText(/say info/)).toBeVisible();
    act(() => {
      jest.advanceTimersByTime(20000);
    });
    expect(getByText(/say info/)).not.toBeVisible();
  });
});
