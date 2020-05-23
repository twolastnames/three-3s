import { fetchWithMessages } from './fetchWithMessages';

describe('fetchWithMessages', () => {
  describe('a 200 status', () => {
    let displayFailureMessage;
    let displaySuccessMessage;
    let returned;

    beforeEach(async () => {
      displayFailureMessage = jest.fn();
      displaySuccessMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        return { ok: true, json: async () => ({ a: 'result' }) };
      });
      returned = await fetchWithMessages({ method: 'GET' })(
        displayFailureMessage,
        displaySuccessMessage
      )('my description', '/my/url');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('gives an info message', () => {
      expect(displaySuccessMessage).toBeCalledTimes(1);
      expect(displaySuccessMessage).toBeCalledWith(
        'info',
        'success with my description'
      );
    });

    it('returns the data', () => {
      expect(returned).toEqual({ a: 'result' });
    });

    it('does not give an error message', () => {
      expect(displayFailureMessage).toBeCalledTimes(0);
    });

    it('is called with requested uri', () => {
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith('/my/url', { method: 'GET' });
    });
  });

  describe('a non 200 status', () => {
    let displayFailureMessage;
    let displaySuccessMessage;
    let returned;

    beforeEach(async () => {
      displayFailureMessage = jest.fn();
      displaySuccessMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        return { status: 400 };
      });
      returned = await fetchWithMessages({ method: 'GET' })(
        displayFailureMessage,
        displaySuccessMessage
      )('my description', '/my/url');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('does not give an info message', () => {
      expect(displaySuccessMessage).toBeCalledTimes(0);
    });

    it('returns an empty dataset', () => {
      expect(returned).toEqual({});
    });

    it('gives an error message', () => {
      expect(displayFailureMessage).toBeCalledTimes(1);
      expect(displayFailureMessage).toBeCalledWith(
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
    let displayFailureMessage;
    let displaySuccessMessage;
    let returned;

    beforeEach(async () => {
      displayFailureMessage = jest.fn();
      displaySuccessMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('my error');
      });
      returned = await fetchWithMessages({ method: 'GET' })(
        displayFailureMessage,
        displaySuccessMessage
      )('my description', '/my/url');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('does not give an info message', () => {
      expect(displaySuccessMessage).toBeCalledTimes(0);
    });

    it('returns an empty dataset', () => {
      expect(returned).toEqual({});
    });

    it('gives an error message', () => {
      expect(displayFailureMessage).toBeCalledTimes(1);
      expect(displayFailureMessage).toBeCalledWith(
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
    let displayFailureMessage;
    let displaySuccessMessage;
    let returned;

    beforeEach(async () => {
      displayFailureMessage = jest.fn();
      displaySuccessMessage = jest.fn();
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error();
      });
      returned = await fetchWithMessages({ method: 'GET' })(
        displayFailureMessage,
        displaySuccessMessage
      )('my description', '/my/url');
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    it('does not give an info message', () => {
      expect(displaySuccessMessage).toBeCalledTimes(0);
    });

    it('returns an empty dataset', () => {
      expect(returned).toEqual({});
    });

    it('gives an error message', () => {
      expect(displayFailureMessage).toBeCalledTimes(1);
      expect(displayFailureMessage).toBeCalledWith(
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
