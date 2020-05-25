import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { ModifiableSuite } from './ModifiableSuite';
import PropTypes from 'prop-types';

describe.skip('ModifiableSuite', () => {
  describe('an invalid id', () => {
    let displayMessage = jest.fn();
    let wrapper;

    beforeAll(async () => {
      withFetch().mockNotOk(404)
      wrapper = mount(<ModifiableSuite id="5" displayMessage={displayMessage} />)
      await act(() => nextTick())
    })

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/)
    })
    
    it('specfices an error', () => {
      expect(displayMessage).toBeCalledTimes(1)
      expect(displayMessage).toBeCalledWith(
        'error', 'suite with id 5 read with HTTP code 404'
      )
    })
  })
})