import { ProjectInterface } from '@/interfaces/projects';

type ProjectBrief = { title: string; summary: string; tags: string[]; focus: string; notes: string[] };

// Editorial copy is grounded in content/projects/<slug>.md and public/Resume.pdf.
export const selectedProjects: Record<string, ProjectBrief> = {
  'k8-autoscaler': {
    title: 'Preemptive Kubernetes Autoscaler', tags: ['Kubernetes', 'Docker', 'Python'],
    summary: 'Planning cluster capacity from historical traffic, rather than waiting for demand to arrive.',
    focus: 'Infrastructure · Capacity planning',
    notes: ['Built a horizontal and vertical autoscaler with a team, using historical traffic to plan cluster capacity.', 'Integrated Kubernetes REST APIs, Prometheus metrics, and InfluxDB historical telemetry.', 'Packaged the autoscaler as a Helm chart.'],
  },
  atskit: {
    title: 'ATSKit', tags: ['Python', 'SQLite'],
    summary: 'One Python interface for discovering jobs across nine applicant tracking systems.',
    focus: 'Developer tooling · API integration',
    notes: ['Streams normalized results as each portal finishes, rather than waiting for the whole batch.', 'Uses caller-owned SQLite metadata, per-host rate limits, and retry handling.'],
  },
  khan: {
    title: 'Khan', tags: ['Python', 'SQLite', 'CLI'],
    summary: 'An inspectable pipeline for AI engineering work, from implementation brief to human approval.',
    focus: 'Developer tooling · Agent orchestration',
    notes: ['Tracks tasks, sessions, reviews, and adoption decisions in SQLite.', 'Runs candidates in isolated worktrees and keeps adoption under explicit human control.', 'Early infrastructure: the public API and storage schema may evolve.'],
  },
  dotfiles: {
    title: 'Portable developer environment', tags: ['Shell', 'Git', 'Zsh'],
    summary: 'Versioned shell configuration and reusable Git hooks for a consistent local workflow.',
    focus: 'Developer tooling · Environment configuration',
    notes: ['Collects Zsh configuration, Git settings, shared hooks, and helper scripts.', 'The installer backs up existing configuration before linking tracked files.'],
  },
  'TCP-ChatApp': {
    title: 'TCP chat application', tags: ['Java', 'Sockets', 'Multithreading'],
    summary: 'A Java chat project exploring TCP sockets, threading, and Diffie–Hellman encryption.',
    focus: 'Systems · Networking',
    notes: ['Combines socket communication, multithreading, and Diffie–Hellman encryption.', 'The repository identifies this project as under development.'],
  },
  scholarhub: {
    title: 'ScholarHub', tags: ['Ruby on Rails'],
    summary: 'A research collaboration portal for NIT students. I contributed all frontend work.',
    focus: 'Product · Frontend contribution',
    notes: ['Built with Abhishek Kumar to bring papers, collaborators, events, and grants into one portal.', 'My contribution covered the entire frontend.'],
  },
  'foss-js': {
    title: 'JavaScript open-source contributions', tags: ['JavaScript'],
    summary: 'Library ownership and contributions to authentication, OTP input, and scroll interfaces.',
    focus: 'Product · Open-source libraries',
    notes: ['Owned @twzzr/authfather.', 'Contributed pull requests to Devfolio’s react-otp-input and scroll-in libraries.'],
  },
  MedicalVR: {
    title: 'MedicalVR', tags: ['HTML', 'JavaScript', 'WebGL'],
    summary: 'A browser-based medical learning project using JavaScript and WebGL.',
    focus: 'Product · Browser experience',
    notes: ['Uses HTML, JavaScript, and WebGL.', 'The linked project opens separately from this portfolio.'],
  },
};

const tagLabels: Record<string, string> = { c: 'C', cplusplus: 'C++', js: 'JavaScript', javascript: 'JavaScript', html: 'HTML', css: 'CSS', cli: 'CLI', 'ruby on rails': 'Ruby on Rails', 'machine-learning': 'Machine learning', 'jupyter-notebook': 'Jupyter Notebook' };
export function normalizeTags(tags: string[] = []): string[] {
  return [...new Set(tags.map(tag => tagLabels[tag.toLowerCase()] || tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()))];
}
export function projectCategory(project: Pick<ProjectInterface, 'frontmatter'>): string {
  const tags = (project.frontmatter.tags || []).join(' ').toLowerCase();
  if (/machine learning|research|data warehousing|information retrieval|jupyter/.test(tags)) return 'Research';
  if (/kubernetes|docker|python|shell|git|cli|java\b|sockets|compiler|c\+\+|zsh|cryptography/.test(tags)) return 'Systems';
  return 'Product';
}
export function cleanProjectSummary(summary: string): string {
  return summary.replace(/<[^>]*>/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[>*#`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 240);
}
