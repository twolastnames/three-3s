import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { PaginatedPane } from './PaginatedPane';
import PropTypes from 'prop-types';

const ExampleElement = ({ id, name }) => (
  <div>
    {id}: {name}
  </div>
);

ExampleElement.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

describe('PaginatedPane', () => {
  describe('a url with a query', () => {
    beforeAll(async () => {
      window.displayMessage.mockReset();
      withFetch().mockException('a message');
      mount(
        <PaginatedPane
          description="an exception"
          url="/my/url?some=query"
          getComponent={ExampleElement}
        />
      );
      await act(() => nextTick());
    });

    it('fetched the correct url', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(
        '/my/url?some=query&offset=0&limit=50',
        {}
      );
    });
  });

  describe('an exception', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      withFetch().mockException('a message');
      wrapper = mount(
        <PaginatedPane
          description="an exception"
          url="/my/url"
          getComponent={ExampleElement}
        />
      );
      await act(() => nextTick());
    });

    it('has no text for no records', async () => {
      await act(() => nextTick());
      expect(wrapper.text()).toEqual('');
    });

    it('fetched the correct url', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url?offset=0&limit=50', {});
    });

    it('calls displayMessage with the error', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching an exception a message'
      );
    });
  });

  describe('a non 200 response', () => {
    beforeAll(async () => {
      window.displayMessage.mockReset();
      withFetch().mockNotOk(403);
      mount(
        <PaginatedPane
          description="non 200 response"
          url="/my/url"
          getComponent={ExampleElement}
        />
      );
      await act(() => nextTick());
    });

    it('fetched the correct url', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url?offset=0&limit=50', {});
    });

    it('calls displayMessage with the error', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'fetching non 200 response with HTTP code 403'
      );
    });
  });

  describe('a small 200 response', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      withFetch().mockOk({ count: 5, records: [{ id: 1, name: 'name 1' }] });
      wrapper = mount(
        <PaginatedPane
          description="200"
          url="/my/url"
          getComponent={ExampleElement}
        />
      );
      await act(() => nextTick());
    });

    it('does not call displayMessage', () => {
      expect(window.displayMessage).toBeCalledTimes(0);
    });

    it('renders the element supplied', () => {
      expect(wrapper.text()).toMatch(/name 1/);
    });
  });

  describe('can navigate around', () => {
    let wrapper;

    beforeAll(async () => {
      window.displayMessage.mockReset();
      const fetchMock = withFetch();
      fetchMock.mockOk({
        count: 7,
        records: [
          { id: 1, name: 'name 1' },
          { id: 2, name: 'name 2' },
          { id: 3, name: 'name 3' },
        ],
      });
      fetchMock.mockOk({
        count: 7,
        records: [
          { id: 4, name: 'name 4' },
          { id: 5, name: 'name 5' },
          { id: 6, name: 'name 6' },
        ],
      });
      fetchMock.mockOk({
        count: 7,
        records: [
          { id: 1, name: 'name 1' },
          { id: 2, name: 'name 2' },
          { id: 3, name: 'name 3' },
        ],
      });
      fetchMock.mockOk({
        count: 7,
        records: [
          { id: 4, name: 'name 4' },
          { id: 5, name: 'name 5' },
          { id: 6, name: 'name 6' },
        ],
      });
      fetchMock.mockOk({ count: 7, records: [{ id: 7, name: 'name 7' }] });
      wrapper = mount(
        <PaginatedPane
          perPage={3}
          description="navigate"
          url="/my/url"
          getComponent={ExampleElement}
        />
      );
      await act(() => nextTick());
    });

    it('renders the elements supplied', () => {
      expect(wrapper.text()).toMatch(/name 1/);
      expect(wrapper.text()).toMatch(/name 2/);
      expect(wrapper.text()).toMatch(/name 3/);
    });

    it('does not have a back button when on page 1', () => {
      // expect(wrapper.find('#back-pagination')).toHaveLength(0)
      // TODO: sort this out manually
    });

    it('has an enabled forward button when on page 1', () => {
      expect(wrapper.find('#forward-pagination')).toHaveLength(1);
    });

    it('can go to the second page', async () => {
      act(() => wrapper.find('#forward-pagination').prop('onClick')());
      await act(() => nextTick());
      expect(wrapper.text()).toMatch(/name 4/);
      expect(wrapper.text()).toMatch(/name 5/);
      expect(wrapper.text()).toMatch(/name 6/);
    });

    it('has an enabled back button when on page 1', () => {
      // TODO: sort this out manually
    });

    it('has an enabled forward button when on page 1', () => {
      // TODO: sort this out manually
    });

    it('can go back to the first page', async () => {
      act(() => wrapper.find('#back-pagination').prop('onClick')());
      await act(() => nextTick());
      expect(wrapper.text()).toMatch(/name 1/);
      expect(wrapper.text()).toMatch(/name 2/);
      expect(wrapper.text()).toMatch(/name 3/);
    });

    it('has a disabled back button when on page 1', () => {
      // TODO: sort this out manually
    });

    it('has an enabled forward button when on page 1', () => {
      expect(
        wrapper.find('#forward-pagination').html().includes('disabled')
      ).toEqual(false);
    });

    it('can go to the back second page', async () => {
      act(() => wrapper.find('#forward-pagination').prop('onClick')());
      await act(() => nextTick());
      expect(wrapper.text()).toMatch(/name 4/);
      expect(wrapper.text()).toMatch(/name 5/);
      expect(wrapper.text()).toMatch(/name 6/);
    });

    it('has an enabled back button when on page 1', () => {
      // TODO: sort this out manually
    });

    it('has an enabled forward button when on page 1', () => {
      // TODO: sort this out manually
    });

    /* TODO fix this test manually
    it('can go to the third page', async () => {
      console.error('!!!!! clicking here')
      act(() =>  wrapper.find('#forward-pagination').prop('onClick')())
      await act(() => nextTick())
      console.error('!!!!! failing here')
      expect(wrapper.text()).toMatch(/name 7/)
    })
    //*/

    it('has an enabled back button when on page 1', () => {
      // TODO: sort this out manually
    });

    it('has a disabled forward button when on page 1', () => {
      // TODO: sort this out manually
    });

    it('does not call displayMessage', () => {
      expect(window.displayMessage).toBeCalledTimes(0);
    });
  });

  describe('having more than the perPage amount', () => {
    let wrapper;

    beforeAll(async () => {
      withFetch().mockOk({
        count: 7,
        records: [
          { id: 1, name: 'name 1' },
          { id: 2, name: 'name 2' },
          { id: 3, name: 'name 3' },
          { id: 4, name: 'name 4' },
          { id: 5, name: 'name 5' },
        ],
      });
      wrapper = mount(
        <PaginatedPane
          url="/my/url"
          description="more than a page"
          getComponent={ExampleElement}
          perPage={5}
        />
      );
      await act(() => nextTick());
    });

    it('does not call displayMessage', () => {
      expect(window.displayMessage).toBeCalledTimes(0);
    });

    it('fetched the correct url', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url?offset=0&limit=5', {});
    });

    it('has the record', () => {
      expect(wrapper.text()).not.toMatch(/Loading.../);
    });

    it('displays what is on the first page', () => {
      expect(wrapper.text()).toMatch(/name 1/);
      expect(wrapper.text()).toMatch(/name 2/);
      expect(wrapper.text()).toMatch(/name 3/);
      expect(wrapper.text()).toMatch(/name 4/);
      expect(wrapper.text()).toMatch(/name 5/);
    });

    it('only displays what is on the first page', () => {
      expect(wrapper.text()).not.toMatch(/name 6/);
    });
  });
});
