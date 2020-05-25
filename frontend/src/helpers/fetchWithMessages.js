export const fetchWithMessages = (options = {}) => (
  level = 'error'
) => async (description, url) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const message = `${description} with HTTP code ${response.status}`;
      window.displayMessage('error', message);
      return {};
    }
    if(level === 'info') {
      window.displayMessage('info', `success with ${description}`);
    }
    return await response.json();
  } catch (e) {
    const message = `${description} ${
      e.message ? e.message : 'no error message given'
    }`;
    window.displayMessage('error', message);
  }
  return {};
};
