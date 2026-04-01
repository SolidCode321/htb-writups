/** @type {import('next').NextConfig} */

// Detect if we are building for GitHub Pages
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// Replace 'htb-writups' with your actual repository name if it differs
const repo = 'htb-writups';

const nextConfig = {
  output: 'export',
  // basePath and assetPrefix are only needed for GitHub Pages project sites
  basePath: isGithubActions ? `/${repo}` : '',
  assetPrefix: isGithubActions ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
