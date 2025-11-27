#!/usr/bin/env node

/**
 * Script to build and start the Next.js production server
 * Builds the app if .next directory doesn't exist or is outdated
 */

import { existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const nextDir = join(projectRoot, '.next');
const buildIdPath = join(nextDir, 'BUILD_ID');

function needsBuild() {
    // Check if .next directory exists
    if (!existsSync(nextDir)) {
        return true;
    }

    // Check if BUILD_ID exists (indicates a successful build)
    if (!existsSync(buildIdPath)) {
        return true;
    }

    // Check if package.json is newer than build (optional - can be removed if too aggressive)
    try {
        const packageJsonPath = join(projectRoot, 'package.json');
        const packageJsonStat = statSync(packageJsonPath);
        const buildIdStat = statSync(buildIdPath);
        
        if (packageJsonStat.mtime > buildIdStat.mtime) {
            return true;
        }
    } catch {
        // If we can't check, assume build is needed
        return true;
    }

    return false;
}

function build() {
    console.log('🔨 Building Next.js application...');
    try {
        execSync('npm run build', {
            cwd: projectRoot,
            stdio: 'inherit',
        });
        console.log('✅ Build completed successfully\n');
    } catch {
        console.error('❌ Build failed');
        process.exit(1);
    }
}

function start() {
    console.log('🚀 Starting production server...\n');
    try {
        execSync('next start', {
            cwd: projectRoot,
            stdio: 'inherit',
        });
    } catch {
        console.error('❌ Failed to start server');
        process.exit(1);
    }
}

// Main execution
if (needsBuild()) {
    build();
} else {
    console.log('✅ Build already exists, skipping build step\n');
}

start();

