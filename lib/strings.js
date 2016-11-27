const hdoc = (str) => {
  if (!str) {
    return str;
  }

  const lines = str.split('\n');
  if (!lines[0]) {
    lines.shift();
  }
  const firstLine = lines.filter(s => s.length > 0)[0] || '';
  const omitIndent = firstLine.match(/^(\s*)/)[0];
  return lines.map(s =>
    s.replace(new RegExp(`^${omitIndent}`), '')
  ).join('\n');
};

module.exports = {
  hdoc  
};
