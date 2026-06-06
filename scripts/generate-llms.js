const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../content');
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects');
const PROJECT_SYNC_MANIFEST = path.join(PROJECTS_DIR, '.github-sync.json');
const OUTPUT_FILE = path.join(__dirname, '../public/llms.txt');

const REPLACEMENTS = {
  'University of Colorado Boulder': 'a major US University',
  'Visa Inc': 'a global financial services company',
  'ZOLL Data Systems': 'a healthcare data systems company',
  'Twzzr': 'a technology startup',
  'Boulder, CO': 'USA',
  'NITK': 'a technical institute',
  'NIT Rourkela': 'a technical institute'
};

function sanitize(text) {
  if (!text) return '';
  
  // Split by potential URLs in parentheses or brackets to avoid mangling them
  // This is a simple heuristic to avoid replacing text inside (http...) or [Link](http...)
  const parts = text.split(/(\[.*?\]\(.*?\))|(\(.*?\))/g);
  
  return parts.map(part => {
    if (!part) return '';
    // If it looks like a link or is inside parentheses, don't sanitize
    if (part.startsWith('(') || part.startsWith('[')) return part;
    
    let sanitized = part;
    for (const [oldValue, newValue] of Object.entries(REPLACEMENTS)) {
      const regex = new RegExp(oldValue, 'gi');
      sanitized = sanitized.replace(regex, newValue);
    }
    return sanitized;
  }).join('').trim();
}

function cleanExcerpt(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getProjectExcerpt(body, summary) {
  if (summary && summary.trim()) {
    return cleanExcerpt(summary);
  }

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    if (/^#{1,6}\s+.+$/.test(paragraph) && !paragraph.includes('\n')) {
      continue;
    }

    const cleaned = cleanExcerpt(paragraph);
    if (cleaned) {
      return cleaned;
    }
  }

  return '';
}

function loadProjectMarkdownFiles() {
  const projectFiles = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.md'));
  const loaded = projectFiles.map(file => {
    const parsed = matter(fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8'));
    return {
      file,
      data: parsed.data || {},
      body: parsed.content || '',
    };
  });

  if (!fs.existsSync(PROJECT_SYNC_MANIFEST)) {
    return loaded;
  }

  const generated = loaded.filter(project => project.data.source === 'github');
  return generated.length > 0 ? generated : loaded;
}

function generateLLMS() {
  let content = '# Nirmal Khedkar\n\n';
  content += 'Expert Software Engineer specializing in full-stack development, distributed systems, and mobile applications.\n\n';

  // 1. Load Main Content / Summary
  try {
    const mainContentPath = path.join(CONTENT_DIR, 'yml/mainContent.md');
    const mainContentRaw = fs.readFileSync(mainContentPath, 'utf8');
    const { content: mainBody } = matter(mainContentRaw);
    content += '## Summary\n' + sanitize(mainBody) + '\n\n';
  } catch (e) {
    console.error('Error loading mainContent.md', e);
  }

  // 2. Load Skills
  try {
    const skillsPath = path.join(CONTENT_DIR, 'yml/skills.yaml');
    const skills = yaml.load(fs.readFileSync(skillsPath, 'utf8'));
    content += '## Skills\n';
    const skillList = skills.map(s => s.name).join(', ');
    content += skillList + '\n\n';
  } catch (e) {
    console.error('Error loading skills.yaml', e);
  }

  // 3. Load Work Experience
  try {
    const workPath = path.join(CONTENT_DIR, 'yml/workexperiences.yaml');
    const experiences = yaml.load(fs.readFileSync(workPath, 'utf8'));
    content += '## Experience\n\n';
    experiences.forEach(exp => {
      content += `### ${sanitize(exp.post)} | ${sanitize(exp.company)} | ${exp.timeframe}\n`;
      if (Array.isArray(exp.description)) {
        exp.description.forEach(bullet => {
          content += `- ${sanitize(bullet)}\n`;
        });
      }
      content += '\n';
    });
  } catch (e) {
    console.error('Error loading workexperiences.yaml', e);
  }

  // 4. Load Projects
  try {
    content += '## Projects\n\n';

    loadProjectMarkdownFiles().forEach(project => {
      if (project.data.title) {
        content += `### ${project.data.title}\n`;
        const summary = getProjectExcerpt(project.body, project.data.summary);
        content += sanitize(summary) + '\n\n';
      }
    });
  } catch (e) {
    console.error('Error loading projects', e);
  }

  // 5. Hardcoded Links (Safe)
  content += '## Profiles\n';
  content += '- GitHub: https://www.github.com/nirmalhk7\n';
  content += '- LinkedIn: https://www.linkedin.com/in/nirmalhk7/\n';
  content += '- RSS Feed: /api/rss\n';

  fs.writeFileSync(OUTPUT_FILE, content);
  console.log('llms.txt generated successfully.');
}

generateLLMS();
