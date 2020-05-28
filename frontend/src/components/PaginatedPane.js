import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchWithMessages } from '../helpers/fetchWithMessages';

const getWithMessages = fetchWithMessages();

const BACK_PAGE_IMAGE_DATA =
  'M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z';

const BackImage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d={BACK_PAGE_IMAGE_DATA} />
  </svg>
);

const FORWARD_PAGE_IMAGE_DATA =
  'M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z';

const ForwardImage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d={FORWARD_PAGE_IMAGE_DATA} />
  </svg>
);

const decrementPage = (setPage, onPage) => () => setPage(onPage - 1);

const incrementPage = (setPage, onPage) => () => setPage(onPage + 1);

const PageBrowser = ({ onPage, lastPage, setPage }) => (
  <ul>
    <li style={onPage === 0 ? { display: 'none' } : {}}>
      <button id="back-pagination" onClick={decrementPage(setPage, onPage)}>
        <BackImage />
      </button>
    </li>
    <li style={onPage === lastPage ? { display: 'none' } : {}}>
      <button id="forward-pagination" onClick={incrementPage(setPage, onPage)}>
        <ForwardImage />
      </button>
    </li>
  </ul>
);

PageBrowser.propTypes = {
  onPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

let reactKey = 0;

const renderComponent = (getComponent, updatePage) => (elementData) => (
  <li key={++reactKey}>{getComponent(elementData, updatePage)}</li>
);

const getOffset = (page, perPage) => page * perPage;

const getLastPage = (count, perPage) => Math.floor(count / perPage);

const getPaginatedPath = (onPage, perPage, url) =>
  `${url}?offset=${getOffset(onPage, perPage)}&limit=${perPage}`;

const loadElements = async (
  description,
  url,
  page,
  perPage,
  setElements,
  setCount
) => {
  setCount(0);
  setElements(null);
  const paginatedPath = getPaginatedPath(page, perPage, url);
  const fetched = await getWithMessages(
    `fetching ${description}`,
    paginatedPath
  );
  setCount(fetched.count || 0);
  setElements(fetched.records || []);
};

PaginatedPane.propTypes = {
  description: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  perPage: PropTypes.number,
};

export function PaginatedPane({
  getComponent,
  description,
  url,
  perPage = 50,
}) {
  const [page, setPage] = useState(0); // first page is page 0
  const [count, setCount] = useState(0);
  const [elements, setElements] = useState(null);

  const updatePage = useCallback(() => {
    loadElements(description, url, page, perPage, setElements, setCount);
  }, [page, description, perPage, url]);

  useEffect(() => {
    updatePage();
  }, [page, updatePage]);

  const lastPage = getLastPage(count, perPage);
  return (
    <div>
      <PageBrowser onPage={page} setPage={setPage} lastPage={lastPage} />
      <ul>
        {!elements
          ? 'Loading...'
          : elements.map(renderComponent(getComponent, updatePage))}
      </ul>
    </div>
  );
}
