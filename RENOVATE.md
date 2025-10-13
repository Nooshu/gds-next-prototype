# Renovate Bot Setup

This repository is configured to use [Renovate Bot](https://renovatebot.com/) for automatic dependency updates.

## Configuration

The Renovate configuration is stored in `renovate.json` and includes:

### Key Features
- **Scheduled Updates**: Runs every Monday before 9am (Europe/London timezone)
- **Grouped Updates**: Related packages are grouped together for easier review
- **Auto-merge**: Patch updates for dev dependencies are automatically merged
- **Security Alerts**: Vulnerability updates are flagged with security labels
- **Lock File Maintenance**: Monthly updates to lock files

### Update Groups
- **All non-major updates**: Minor and patch updates grouped together
- **React ecosystem**: Major updates for React, React DOM, and their types
- **Next.js**: Major updates for Next.js and related packages
- **TypeScript**: Major updates for TypeScript and Node types
- **GOV.UK Frontend**: Major updates for GOV.UK and Ministry of Justice packages

## Setting up Renovate Bot

### Option 1: GitHub App (Recommended)
1. Go to [Renovate Bot on GitHub](https://github.com/apps/renovate)
2. Click "Install" and select your repository
3. Renovate will automatically detect the `renovate.json` configuration
4. It will create a "Configure Renovate" pull request to enable the bot

### Option 2: Self-hosted
If you're using a self-hosted Renovate instance, the configuration will be automatically picked up from the `renovate.json` file.

## What to Expect

Once enabled, Renovate Bot will:
1. Create a Dependency Dashboard issue to track all updates
2. Create pull requests for dependency updates based on the schedule
3. Group related updates together to reduce PR noise
4. Auto-merge safe patch updates for dev dependencies
5. Flag security vulnerabilities immediately

## Customization

You can modify the `renovate.json` file to adjust:
- Update schedules
- Grouping rules
- Auto-merge policies
- Branch naming
- PR titles and commit messages

For more information, see the [Renovate Bot documentation](https://docs.renovatebot.com/).
