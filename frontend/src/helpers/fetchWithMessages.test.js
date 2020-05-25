import { fetchWithMessages } from './fetchWithMessages';

describe('fetchWithMessages', () => {
  describe('a 200 status', () => {
    let returned;

    beforeEach(async () => {
      window.displayMessage.mockReset()
      withFetch().mockOk({ a: 'result' });
      returned = await fetchWithMessages({ method: 'GET' })(
        'info'
      )('my description', '/my/url');
    });

    it('gives an info message', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'info',
        'success with my description'
      );
    });

    it('returns the data', () => {
      expect(returned).toEqual({ a: 'result' });
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'GET' });
    });
  });

  describe('a non 200 status', () => {
    let returned;

    beforeEach(async () => {
      window.displayMessage.mockReset()
      withFetch().mockNotOk(400);
      returned = await fetchWithMessages({ method: 'GET' })(
        'error'
      )('my description', '/my/url');
    });

    it('returns an empty dataset', () => {
      expect(returned).toEqual({});
    });

    it('gives an error message', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'my description with HTTP code 400'
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'GET' });
    });
  });

  describe('an exception with a message', () => {
    let returned;

    beforeEach(async () => {
      window.displayMessage.mockReset()
      withFetch().mockException('my error');
      returned = await fetchWithMessages({ method: 'GET' })(
      )('my description', '/my/url');
    });

    it('returns an empty dataset', () => {
      expect(returned).toEqual({});
    });

    it('gives an error message', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'my description my error'
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'GET' });
    });
  });

  describe('an exception without a message', () => {
    let returned;

    beforeEach(async () => {
      window.displayMessage = jest.fn()
      withFetch().mockException();
      returned = await fetchWithMessages({ method: 'GET' })(
        'error'
      )('my description', '/my/url');
    });

    it('returns an empty dataset', () => {
      expect(returned).toEqual({});
    });

    it('gives an error message', () => {
      expect(window.displayMessage).toBeCalledTimes(1);
      expect(window.displayMessage).toBeCalledWith(
        'error',
        'my description no error message given'
      );
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'GET' });
    });
  });
});
