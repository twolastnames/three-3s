export const fetchWithMessages = (options = {}) => (
  displayFailureMessage,
  displaySuccessMessage = () => {}
) => async (description, url) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const message = `${description} with HTTP code ${response.status}`;
      displayFailureMessage('error', message);
      return {};
    }
    displaySuccessMessage('info', `success with ${description}`);
    return await response.json();
  } catch (e) {
    const message = `${description} ${
      e.message ? e.message : 'no error message given'
    }`;
    displayFailureMessage('error', message);
  }
  return {};
};
