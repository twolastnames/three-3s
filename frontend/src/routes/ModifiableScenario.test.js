import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { ModifiableScenario } from './ModifiableScenario';

describe('ModifiableScenario', () => {
  describe.skip('an invalid id', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset()
      withFetch().mockNotOk(404)
      wrapper = mount(<ModifiableScenario id="6" />)
      await act(() => nextTick())
    })

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/)
    })
    
    it('specfices an error', () => {
      expect(window.displayMessage).toBeCalledTimes(1)
      expect(window.displayMessage).toBeCalledWith(
        'error', 'suite with id 6 read with HTTP code 404'
      )
    })
  })
})