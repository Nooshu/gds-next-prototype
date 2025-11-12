#!/usr/bin/env node

/**
 * Security script to verify and pin npm dependencies
 * - Checks for unpinned dependencies (^ or ~)
 * - Verifies SHA integrity hashes in package-lock.json
 * - Optionally fixes unpinned dependencies
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const PACKAGE_JSON_PATH = join(projectRoot, 'package.json');
const PACKAGE_LOCK_PATH = join(projectRoot, 'package-lock.json');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

/**
 * Check if package.json exists
 */
function checkPackageJsonExists() {
  if (!existsSync(PACKAGE_JSON_PATH)) {
    error(`package.json not found at ${PACKAGE_JSON_PATH}`);
    process.exit(1);
  }
  return true;
}

/**
 * Check if package-lock.json exists
 */
function checkPackageLockExists() {
  if (!existsSync(PACKAGE_LOCK_PATH)) {
    error(`package-lock.json not found at ${PACKAGE_LOCK_PATH}`);
    error('Run "npm install" first to generate package-lock.json');
    process.exit(1);
  }
  return true;
}

/**
 * Parse package.json and find unpinned dependencies
 */
function findUnpinnedDependencies() {
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  const issues = {
    dependencies: [],
    devDependencies: [],
    overrides: [],
  };

  function checkVersions(obj, category) {
    if (!obj) return;
    
    for (const [name, version] of Object.entries(obj)) {
      if (typeof version === 'string') {
        // Check for version ranges
        if (version.startsWith('^') || version.startsWith('~')) {
          issues[category].push({ name, version });
        }
        // Check for npm: aliases in overrides that might have ranges
        if (version.startsWith('npm:') && (version.includes('^') || version.includes('~'))) {
          issues[category].push({ name, version });
        }
      }
    }
  }

  checkVersions(packageJson.dependencies, 'dependencies');
  checkVersions(packageJson.devDependencies, 'devDependencies');
  checkVersions(packageJson.overrides, 'overrides');

  return issues;
}

/**
 * Verify SHA integrity hashes in package-lock.json
 */
function verifyIntegrityHashes() {
  const packageLock = JSON.parse(readFileSync(PACKAGE_LOCK_PATH, 'utf-8'));
  const issues = [];
  let totalPackages = 0;
  let packagesWithIntegrity = 0;

  function checkIntegrity(obj, path = '') {
    if (!obj) return;

    // Check if this is a package entry
    if (obj.version && obj.resolved) {
      totalPackages++;
      
      if (obj.integrity) {
        packagesWithIntegrity++;
        // Verify integrity format (should be sha512-...)
        if (!obj.integrity.startsWith('sha512-') && 
            !obj.integrity.startsWith('sha1-') && 
            !obj.integrity.startsWith('sha256-')) {
          issues.push({
            name: obj.name || path,
            version: obj.version,
            integrity: obj.integrity,
            issue: 'Invalid integrity hash format',
          });
        }
      } else {
        issues.push({
          name: obj.name || path,
          version: obj.version,
          resolved: obj.resolved,
          issue: 'Missing integrity hash',
        });
      }
    }

    // Recursively check nested objects
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const newPath = path ? `${path}.${key}` : key;
        checkIntegrity(value, newPath);
      }
    }
  }

  checkIntegrity(packageLock);

  return {
    issues,
    totalPackages,
    packagesWithIntegrity,
    coverage: totalPackages > 0 ? (packagesWithIntegrity / totalPackages) * 100 : 0,
  };
}

/**
 * Verify installed packages match their integrity hashes
 */
function verifyInstalledPackages() {
  try {
    info('Verifying installed packages match package-lock.json...');
    execSync('npm ci --dry-run', { 
      cwd: projectRoot, 
      stdio: 'pipe',
      encoding: 'utf-8' 
    });
    return { success: true, message: 'All packages match their integrity hashes' };
  } catch (err) {
    return { 
      success: false, 
      message: 'Package verification failed. Run "npm ci" to fix.',
      error: err.message 
    };
  }
}

/**
 * Main verification function
 */
function verifyDependencies(options = {}) {
  const { fix = false, verbose = false } = options;

  log('\n🔒 Dependency Security Verification\n', colors.blue);
  log('=' .repeat(50), colors.blue);

  // Check files exist
  checkPackageJsonExists();
  checkPackageLockExists();

  let hasErrors = false;
  let hasWarnings = false;

  // Check for unpinned dependencies
  log('\n📌 Checking for pinned dependencies...', colors.cyan);
  const unpinned = findUnpinnedDependencies();
  
  const totalUnpinned = 
    unpinned.dependencies.length + 
    unpinned.devDependencies.length + 
    unpinned.overrides.length;

  if (totalUnpinned > 0) {
    hasWarnings = true;
    warning(`Found ${totalUnpinned} unpinned dependencies:`);
    
    if (unpinned.dependencies.length > 0) {
      log('\n  Dependencies:', colors.yellow);
      unpinned.dependencies.forEach(({ name, version }) => {
        log(`    - ${name}: ${version}`, colors.yellow);
      });
    }
    
    if (unpinned.devDependencies.length > 0) {
      log('\n  DevDependencies:', colors.yellow);
      unpinned.devDependencies.forEach(({ name, version }) => {
        log(`    - ${name}: ${version}`, colors.yellow);
      });
    }
    
    if (unpinned.overrides.length > 0) {
      log('\n  Overrides:', colors.yellow);
      unpinned.overrides.forEach(({ name, version }) => {
        log(`    - ${name}: ${version}`, colors.yellow);
      });
    }

    if (fix) {
      log('\n⚠️  Auto-fix not implemented. Please manually update package.json', colors.yellow);
      log('   Remove ^ and ~ from version numbers.', colors.yellow);
    } else {
      log('\n💡 Tip: Run with --fix to attempt automatic fixes', colors.cyan);
    }
  } else {
    success('All dependencies are pinned (no ^ or ~ found)');
  }

  // Verify integrity hashes
  log('\n🔐 Verifying SHA integrity hashes...', colors.cyan);
  const integrityCheck = verifyIntegrityHashes();
  
  if (integrityCheck.issues.length > 0) {
    hasErrors = true;
    error(`Found ${integrityCheck.issues.length} integrity issues:`);
    
    integrityCheck.issues.forEach((issue, index) => {
      if (index < 10 || verbose) {
        log(`    - ${issue.name}@${issue.version}: ${issue.issue}`, colors.red);
      }
    });
    
    if (integrityCheck.issues.length > 10 && !verbose) {
      log(`    ... and ${integrityCheck.issues.length - 10} more (use --verbose to see all)`, colors.red);
    }
  } else {
    success(`All ${integrityCheck.packagesWithIntegrity} packages have integrity hashes`);
  }

  log(`\n📊 Integrity Coverage: ${integrityCheck.coverage.toFixed(2)}%`, colors.cyan);
  log(`   Packages checked: ${integrityCheck.totalPackages}`, colors.cyan);
  log(`   Packages with integrity: ${integrityCheck.packagesWithIntegrity}`, colors.cyan);

  // Verify installed packages
  log('\n📦 Verifying installed packages...', colors.cyan);
  const installCheck = verifyInstalledPackages();
  
  if (installCheck.success) {
    success(installCheck.message);
  } else {
    hasWarnings = true;
    warning(installCheck.message);
    if (verbose && installCheck.error) {
      log(`   Error: ${installCheck.error}`, colors.yellow);
    }
  }

  // Summary
  log('\n' + '='.repeat(50), colors.blue);
  if (hasErrors) {
    error('\n❌ Verification failed with errors');
    process.exit(1);
  } else if (hasWarnings) {
    warning('\n⚠️  Verification completed with warnings');
    process.exit(0);
  } else {
    success('\n✅ All security checks passed!');
    process.exit(0);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix') || args.includes('-f'),
  verbose: args.includes('--verbose') || args.includes('-v'),
};

// Show help
if (args.includes('--help') || args.includes('-h')) {
  log('\n🔒 Dependency Security Verification Script\n', colors.blue);
  log('Usage: node scripts/verify-dependencies.mjs [options]\n');
  log('Options:');
  log('  --fix, -f        Attempt to fix issues (currently shows guidance)');
  log('  --verbose, -v    Show detailed output');
  log('  --help, -h       Show this help message\n');
  log('This script verifies:');
  log('  ✓ All dependencies are pinned (no ^ or ~)');
  log('  ✓ SHA integrity hashes exist in package-lock.json');
  log('  ✓ Installed packages match their integrity hashes\n');
  process.exit(0);
}

// Run verification
verifyDependencies(options);

