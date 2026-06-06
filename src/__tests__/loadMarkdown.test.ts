import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadMarkdownFile } from '../util/loadMarkdown';

const listMarkdownFiles = (dir: string): string[] => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(fullPath);
    }
    return entry.name.endsWith('.md') ? [fullPath] : [];
  });
};

describe('loadMarkdown util', () => {
  it('loads every markdown file under content without throwing', () => {
    const contentRoot = path.resolve(__dirname, '../../content');
    const markdownFiles = listMarkdownFiles(contentRoot);
    
    console.log(`Loaded ${markdownFiles.length} markdown files`);
    markdownFiles.forEach((filePath) => {
      const slug = path.basename(filePath, '.md');
      expect(() => loadMarkdownFile(filePath, slug)).not.toThrow();
    });
  });

  it('derives a useful excerpt from body content when no summary is provided', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'markdown-excerpt-'));
    const filePath = path.join(tempDir, 'project.md');
    fs.writeFileSync(
      filePath,
      `---\ntitle: Demo Project\n---\n# Demo Project\n\nThis is the excerpt we want.\n`
    );

    const result = loadMarkdownFile(filePath, 'project', {
      getContent: true,
      getExcerpt: true,
    });

    expect(result.excerpt).toBe('This is the excerpt we want.');
  });
});
