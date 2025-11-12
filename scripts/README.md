# Security Scripts

## verify-dependencies.mjs

A security script that verifies npm dependencies are properly pinned and have SHA integrity verification.

### Features

- ✅ **Pinned Dependencies Check**: Verifies all dependencies use exact versions (no `^` or `~`)
- ✅ **SHA Integrity Verification**: Checks that all packages in `package-lock.json` have integrity hashes
- ✅ **Package Verification**: Verifies installed packages match their integrity hashes using `npm ci --dry-run`

### Usage

```bash
# Run verification
npm run verify:dependencies

# Run with verbose output
npm run verify:dependencies:verbose

# Or run directly
node scripts/verify-dependencies.mjs

# Show help
node scripts/verify-dependencies.mjs --help
```

### Options

- `--fix, -f`: Attempt to fix issues (currently shows guidance)
- `--verbose, -v`: Show detailed output for all issues
- `--help, -h`: Show help message

### What It Checks

1. **Pinned Dependencies**: Scans `package.json` for version ranges (`^` or `~`) in:
   - `dependencies`
   - `devDependencies`
   - `overrides`

2. **Integrity Hashes**: Verifies `package-lock.json` contains SHA integrity hashes for all packages:
   - Checks for missing integrity hashes
   - Validates integrity hash format (sha512, sha256, or sha1)
   - Reports coverage percentage

3. **Package Verification**: Uses `npm ci --dry-run` to verify:
   - Installed packages match `package-lock.json`
   - Package integrity hashes are valid

### Exit Codes

- `0`: All checks passed (may have warnings)
- `1`: Verification failed with errors

### Example Output

```
🔒 Dependency Security Verification

==================================================

📌 Checking for pinned dependencies...
✅ All dependencies are pinned (no ^ or ~ found)

🔐 Verifying SHA integrity hashes...
✅ All 769 packages have integrity hashes

📊 Integrity Coverage: 100.00%
   Packages checked: 769
   Packages with integrity: 769

📦 Verifying installed packages...
✅ All packages match their integrity hashes

==================================================
✅ All security checks passed!
```

### Integration

This script can be integrated into:

- **CI/CD pipelines**: Run as part of your build process
- **Pre-commit hooks**: Verify dependencies before committing
- **Security audits**: Regular security checks

### Best Practices

1. Run this script before committing changes to `package.json`
2. Run in CI/CD to ensure dependencies remain pinned
3. Use `--verbose` flag when troubleshooting dependency issues
4. Keep `package-lock.json` committed to version control

