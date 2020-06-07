const isBeginning = (statement) =>
  !!statement.trim().match(/^given |^when |^then /i);

const getKeyword = (statement) =>
  statement.split(/\s+/i, 1)[0].trim().toLowerCase();

const getText = (statement) => statement.replace(/^\w+/, '').trim();

const getStatmentObject = (statement) => ({
  keyword: getKeyword(statement),
  text: getText(statement),
});

const parseLine = (statement) =>
  isBeginning(statement) ? getStatmentObject(statement) : null;

const appendLine = (reduced, line, fullText) =>
  line
    ? reduced.push(line)
    : (reduced[reduced.length - 1].text += ` ${fullText}`);

const handleLine = (reduced, current) => {
  const trimmed = current.trim();
  if (trimmed === '') {
    return reduced;
  }
  const line = parseLine(trimmed);
  appendLine(reduced, line, trimmed);
  return reduced;
};

export const getGerkinLines = (text) =>
  isBeginning(text) ? text.split('\n').reduce(handleLine, []) : null;
