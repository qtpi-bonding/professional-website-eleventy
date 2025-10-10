# Container-First Development Context

## CRITICAL: All Development Happens Inside Docker Containers

This project uses a **container-first development approach**. **NO COMMANDS should be run on the host machine** - everything must be executed inside Docker containers.

## How to Execute Commands

### Check if Container is Already Running
```bash
# ALWAYS check first if the container is already running
docker ps

# Look for container named "eleventy-landing-dev"
# If it's running, skip the startup step and go directly to executing commands
```

### Docker Compose Commands (I can run these)
```bash
# Check container status
docker ps

# Build and start containers
docker-compose build eleventy-dev
docker-compose up -d eleventy-dev
docker-compose restart eleventy-dev

# Stop containers
docker-compose down
```

### Interactive Shell Access
```bash
# Get a shell inside the container for multiple commands
docker exec -it eleventy-landing-dev sh
```

## Key Points to Remember

1. **ALL commands run inside containers**: Never run npm, node, tailwindcss, or any build commands on the host machine.

2. **Container name**: The development container is named `eleventy-landing-dev` (defined in docker-compose.yml).

3. **I can run docker-compose commands directly**: `docker-compose build`, `docker-compose up`, `docker ps`, etc.

4. **I need user confirmation for docker exec commands**: I cannot see when `docker exec` commands finish, so I need the user to confirm completion.

5. **Volume mounts enable live development**: 
   - Source code changes on host are reflected in container immediately
   - Configuration files (tailwind.config.js, .eleventy.js, etc.) are mounted
   - Node modules use a named volume for performance

6. **Build tools are container-only**: Tools like Tailwind CSS, Eleventy, and other dependencies only exist inside the container.

## Current Container Setup

- **Development**: `docker-compose up eleventy-dev` runs the dev server with live reload on port 8080
- **Production**: `docker-compose up eleventy-prod` serves static files via nginx on port 80
- **CSS Build Process**: Tailwind CSS compilation happens inside the container using npm scripts

## Development Workflow

1. Start container: `docker-compose up eleventy-dev`
2. Make file changes on host (they're mounted into container)
3. Execute build commands: `docker exec -it eleventy-landing-dev npm run build`
4. View results at http://localhost:8080

## When Implementing Tasks

- **Never use host commands** like `npm install`, `tailwindcss`, etc.
- **Always use `docker exec`** to run commands inside the container
- **Test commands inside container** before considering a task complete
- **Remember**: If it doesn't work inside the container, it doesn't work for this project
- **CRITICAL**: Never run commands that start continuous processes (like `npm run dev`, `npm run serve`) as they will hang forever. Use curl to test HTTP responses instead.
- **MAJOR LIMITATION**: I cannot see when docker exec commands complete - even simple commands like `ls` may appear to hang on my end while they've actually completed successfully on the user's terminal. If a docker exec command seems stuck, assume it completed and continue with the implementation.
- **BUILD COMMAND FEEDBACK**: Commands like `npm run build` and `npm run build:css` complete successfully and output "Done" but I cannot see this feedback. **CRITICAL: Always ask the user to confirm when build commands have completed before proceeding with verification.**
- **TESTING LIMITATION**: I cannot reliably use `docker exec` commands for testing as I cannot see their output properly. Instead, use curl to test HTTP responses and direct file reading to verify implementations.
- **WORKAROUND FOR FEEDBACK**: To get confirmation that build commands completed, use commands that provide immediate output like `docker exec -it eleventy-landing-dev ls -la _site/` to verify generated files exist.
- **COMPLETION DETECTION ISSUE**: I never detect when docker exec commands finish - they appear to hang indefinitely on my end even when successful. I should wait ~3 seconds after issuing a command and then proceed with verification using curl or file reading, rather than waiting for command completion that I cannot see.

## CRITICAL: Command Completion Detection Workaround
The Problem

Commands like docker exec -it eleventy-landing-dev npm run build:css (or any script using a colon, e.g., build:html, start:prod) cause the command to hang indefinitely. This happens because I cannot reliably detect when these types of commands finish or emit output.

This issue only applies to commands with colons (:) in the npm script name.

Standard commands like docker exec -it eleventy-landing-dev npm run build, npm install, or even ls do not have this problem and work as expected (though I still can't see their output unless explicitly handled).

## The Solution

Only use the base build script for all build-related tasks:

docker exec -it eleventy-landing-dev npm run build


Do not use npm run build:css, npm run build:html, or any other colon-based subcommands.

If more build steps are needed, they must be included in the default build script inside package.json.

## BUILD COMMAND RESTRICTION

Due to limitations in detecting completion of docker exec commands with custom script names:

Only use the exact build command:
docker exec -it eleventy-landing-dev npm run build

Do not use any npm scripts with colons (e.g., npm run build:css, npm run build:html) or custom build subcommands. These cannot be reliably executed or detected, and will cause the command to hang indefinitely with no output.

All build-related tasks must go through the default script:

docker exec -it eleventy-landing-dev npm run build