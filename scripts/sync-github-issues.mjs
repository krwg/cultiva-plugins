#!/usr/bin/env node
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getToken() {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN.trim();
  }
  try {
    return execSync('security find-internet-password -s github.com -a krwg -w', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

async function ghRequest(token, repo, method, path, body) {
  const res = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return data;
}

async function findIssue(token, repo, title) {
  const q = encodeURIComponent(`repo:${repo} is:issue "${title.replace(/"/g, '')}" in:title`);
  const res = await fetch(`https://api.github.com/search/issues?q=${q}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
  });
  const data = await res.json();
  return data.items?.find((i) => i.title === title) || null;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const config = JSON.parse(readFileSync(join(__dirname, 'github-issues.json'), 'utf8'));
  const token = getToken();
  if (!token && !dryRun) {
    console.error('[issues] No GITHUB_TOKEN');
    process.exit(1);
  }

  for (const item of config.issues) {
    if (dryRun) {
      console.log(`${item.action || 'open'}: ${item.title}`);
      continue;
    }

    let issue = await findIssue(token, config.repo, item.title);
    if (!issue) {
      issue = await ghRequest(token, config.repo, 'POST', 'issues', {
        title: item.title,
        body: item.body.trim(),
        labels: item.labels || []
      });
      console.log(`created #${issue.number}: ${item.title}`);
    } else {
      console.log(`found #${issue.number}: ${item.title}`);
    }

    if (item.action === 'close') {
      await ghRequest(token, config.repo, 'POST', `issues/${issue.number}/comments`, {
        body: item.closeBody || `Fixed in ${item.commit}`
      });
      await ghRequest(token, config.repo, 'PATCH', `issues/${issue.number}`, {
        state: 'closed',
        state_reason: 'completed'
      });
      console.log(`closed #${issue.number}`);
    }
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
