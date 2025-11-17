#!/usr/bin/env node

/**
 * Script to copy GOV.UK Frontend assets (fonts, images) to public directory
 * This ensures fonts and images referenced in GOV.UK Frontend CSS are available
 */

import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const govukAssetsPath = join(
    projectRoot,
    "node_modules/govuk-frontend/dist/govuk/assets"
);
const publicAssetsPath = join(projectRoot, "public/assets");

function copyRecursive(src, dest) {
    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
            mkdirSync(destPath, { recursive: true });
            copyRecursive(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    }
}

try {
    // Check if GOV.UK Frontend assets exist
    const stats = statSync(govukAssetsPath);
    if (!stats.isDirectory()) {
        console.error(
            `❌ GOV.UK Frontend assets not found at: ${govukAssetsPath}`
        );
        console.error("   Run 'npm install' first to install dependencies.");
        process.exit(1);
    }

    // Create public/assets directory if it doesn't exist
    mkdirSync(publicAssetsPath, { recursive: true });

    // Copy assets
    console.log("📦 Copying GOV.UK Frontend assets...");
    copyRecursive(govukAssetsPath, publicAssetsPath);

    console.log("✅ Successfully copied GOV.UK Frontend assets to public/assets/");
} catch (error) {
    if (error.code === "ENOENT") {
        console.error(
            `❌ GOV.UK Frontend assets not found at: ${govukAssetsPath}`
        );
        console.error("   Run 'npm install' first to install dependencies.");
        process.exit(1);
    } else {
        console.error("❌ Error copying assets:", error.message);
        process.exit(1);
    }
}

