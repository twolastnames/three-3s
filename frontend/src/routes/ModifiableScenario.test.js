import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { ModifiableScenario } from './ModifiableScenario';

describe('ModifiableScenario', () => {
  describe('an invalid id', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      withFetch().mockNotOk(404);
      wrapper = mount(<ModifiableScenario match={{ params: { id: '6' } }} />);
      await act(() => nextTick());
    });

    it('displays Not Found message', () => {
      expect(wrapper.text()).toMatch(/Not Found/);
    });

    it('specfices an error', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'getting scenario with ID 6 with HTTP code 404'
      );
    });
  });
});
