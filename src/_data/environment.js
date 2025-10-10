module.exports = function() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
  
  // Default configuration for local development
  let config = {
    environment: 'development',
    baseUrl: '/',
    url: 'http://localhost:8080'
  };
  
  // Production configuration
  if (isProduction) {
    config.environment = 'production';
    
    // GitHub Pages specific configuration
    if (isGitHubPages) {
      // Extract repository name from GitHub context
      const repository = process.env.GITHUB_REPOSITORY || 'username/repository-name';
      const [owner, repo] = repository.split('/');
      
      // For GitHub Pages, the URL structure depends on whether it's a user/org site or project site
      // User/org sites: https://username.github.io (baseUrl: '/')
      // Project sites: https://username.github.io/repository-name (baseUrl: '/repository-name/')
      
      if (repo === `${owner}.github.io`) {
        // User/organization site
        config.url = `https://${owner}.github.io`;
        config.baseUrl = '/';
      } else {
        // Project site
        config.url = `https://${owner}.github.io/${repo}`;
        config.baseUrl = `/${repo}/`;
      }
    } else {
      // Production but not GitHub Pages (custom domain, etc.)
      config.url = process.env.SITE_URL || 'https://example.com';
      config.baseUrl = process.env.BASE_URL || '/';
    }
  }
  
  return config;
};