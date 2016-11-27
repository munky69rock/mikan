const fs = require('fs');

const DOCUMENTATION_SECTIONS = [
  'description',
  'dependencies',
  'configuration',
  'commands',
  'notes',
  'author',
  'authors',
  'examples',
  'tags',
  'urls'
];

const commands = [];

const isComment = line => {
  return line.substr(0, 2) === '//';
};

const cleanLine = (line, name) => {
  return line.replace(/^\/\/\s*/, '').replace(/^{bot}/i, name).trim();
};

module.exports = {
  parse(filepath, name) {
    const docs = {};
    const body = fs.readFileSync(filepath, 'utf-8');
    const lines = body.split('\n');

    let currentSection;
    lines.some(line => {
      if (!isComment(line)) {
        return true;
      }

      const cleanedLine = cleanLine(line, name);
      if (cleanedLine.length === 0) {
        return;
      }
      if (cleanedLine.toLowerCase() === 'none') {
        return;
      }

      const nextSection = cleanedLine.toLowerCase().replace(':', '');
      if (DOCUMENTATION_SECTIONS.includes(nextSection)) {
        currentSection = nextSection;
      } else if (currentSection) {
        if (currentSection === 'commands') {
          commands.push(cleanedLine.trim());
        }
      }
    });

    if (currentSection === null) {
      docs.commands = [];
      lines.some(line => {
        if (!isComment(line)) {
          return true;
        }
        if (!line.match('-')) {
          return;
        }
        const cleanedLine = cleanLine(line, name);
        commands.push(cleanedLine);
      });
    }
  },
  commands: commands
};
