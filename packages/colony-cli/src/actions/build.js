// Import dependencies
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const spawn = require('cross-spawn');
const semver = require('semver');
const dns = require('dns');
const tmp = require('tmp');
const tarPack = require('tar-pack');
const url = require('url');

// Set packages
const packages = [
  'colony-example',
  'colony-example-angular',
  'colony-example-react',
  'colony-example-vue',
  'colony-starter',
  'colony-starter-angular',
  'colony-starter-contract',
  'colony-starter-react',
  'colony-starter-vue',
];

// Install and build a starter package
const build = async (commander, packageName) => {

  // Log step
  console.log(chalk.cyan('Starting build command...'));

  // Make sure package name is defined
  if (typeof packageName === 'undefined') {

    // Log error
    console.log();
    console.log(chalk.red('ERROR: The name of the package is required.'));
    console.log();

    // Exit on error
    process.exit(1);

  } else if (!packages.includes(packageName)) {

    // Log error
    console.log();
    console.log(chalk.red(`ERROR: "${packageName}" is not a valid package.`));
    console.log();

    // Exit on error
    process.exit(1);

  }

  // Log step
  console.log(chalk.cyan('Verifying yarn is installed...'));

  // Check if yarn is installed
  if (!isYarnInstalled()) {

    // Log error
    console.log();
    console.log(chalk.red('ERROR: Yarn must be installed!'));
    console.log();

    // Exit on error
    process.exit(1);

  }

  // Log step
  console.log(chalk.cyan(`Creating ${packageName} directory...`));

  // Set destination path
  const destinationPath = path.resolve(packageName);

  // Ensure destination exists
  fs.ensureDirSync(destinationPath);

  // Ensure destination directory is empty
  if (fs.readdirSync(destinationPath).length > 0) {

    // Log error
    console.log();
    console.log(chalk.red(`ERROR: The ${packageName} directory must be empty!`));
    console.log();

    // Exit on error
    process.exit(1);

  }

  // Move to destination
  process.chdir(destinationPath);

  // Get the specific package to install
  const specificPackage = getSpecificPackage(
    packageName,
    commander.specific,
  );

  // Log step
  console.log(chalk.cyan(`Preparing to install ${specificPackage}...`));

  // Set tarball
  const tarball = {};

  // Get tarball if not already tarball and/or set declared tarball properties
  if (!specificPackage.match(/^.+\.(tgz|tar\.gz)$/) || specificPackage[0] === '/') {

    // Get package tarball
    const result = getPackageTarball(specificPackage, destinationPath);

    // Set tarball properties
    tarball.name = result.name;
    tarball.path = result.path;

  } else {

    // Set tarball properties
    tarball.name = specificPackage;
    tarball.path = path.join(destinationPath, tarball.name);

  }

  // Create temporary directory
  const temp = await createTemporaryDirectory();

  // Set read stream for temporary directory
  const stream = fs.createReadStream(tarball.path);

  // Extract read stream for temporary directory
  await extractStream(stream, temp.tmpdir);

  // Copy temporary directory to destination directory
  await fs.copy(temp.tmpdir, destinationPath)

  // Temp cleanup
  temp.cleanup();

  // Check if tarball file is in destination directory
  if (fs.existsSync(path.join(destinationPath, tarball.name))) {

    // Remove tarball file
    fs.unlink(tarball.path);

  }

  // Check yarn registry
  const isOnline = await checkOnline();

  // Log step
  console.log(chalk.cyan(`Installing ${specificPackage}...`));

  // Install the package
  await installPackage(
    destinationPath,
    commander.verbose,
    isOnline
  );

  // Log step
  console.log(`Initializing ${chalk.cyan(packageName)}...`);

  // Initialize git
  cp.execSync(`git init`);

  // Prepare initial commit
  cp.execSync(`git add .`);

  // Perform initial commit
  cp.execSync(`git commit -m '${packageName}'`);

  // Install dependencies
  cp.execSync(`yarn`, { stdio: [0, 1, 2] });

  // Change directories
  cp.execSync(`cd ${destinationPath}`);

  // Log step
  console.log(chalk.cyan(`Successfully built ${packageName}!`));

}

// Make sure yarn is installed
const isYarnInstalled = () => {
  try {
    cp.execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Get the specific package to install
const getSpecificPackage = (packageName, specific) => {
  const validSemver = semver.valid(specific);
  if (validSemver) {
    return `@colony/${packageName}@${validSemver}`;
  }
  if (specific) {
    return specific;
  }
  return `@colony/${packageName}`;
}

// Create temporary directory
const createTemporaryDirectory = () => {
  return new Promise((resolve, reject) => {
    tmp.dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          tmpdir: tmpdir,
          cleanup: () => {
            try {
              callback();
            } catch (ignored) {
            }
          },
        });
      }
    });
  });
}

// Extract read stream for temporary directory
const extractStream = (stream, dest) => {
  return new Promise((resolve, reject) => {
    stream.pipe(
      tarPack.unpack(dest, err => {
        if (err) {
          reject(err);
        } else {
          resolve(dest);
        }
      })
    );
  });
}

// Check yarn registry
const checkOnline = () => {
  return new Promise(resolve => {
    dns.lookup('registry.yarnpkg.com', err => {
      let proxy;
      if (err != null && (proxy = getProxy())) {
        dns.lookup(url.parse(proxy).hostname, proxyErr => {
          resolve(proxyErr == null);
        });
      } else {
        resolve(err == null);
      }
    });
  });
}

// Get proxy to check yarn registry
const getProxy = () => {
  if (process.env.https_proxy) {
    return process.env.https_proxy;
  } else {
    try {
      let httpsProxy = cp.execSync('npm config get https-proxy')
        .toString()
        .trim();
      return httpsProxy !== 'null' ? httpsProxy : undefined;
    } catch (e) {
      return;
    }
  }
}

// Get package tarball using npm
const getPackageTarball = (specificPackage, destinationPath) => {

  try {

    // Download tarball
    const tarballName = cp
      .execSync(`npm pack ${specificPackage} --silent`)
      .toString()
      .trim();

    // Set tarball path to current/destination directory
    const tarballPath = path.join(destinationPath, tarballName);

    // Return tarball info
    return {
      name: tarballName,
      path: tarballPath,
    };

  } catch (exec) {

    // Log error
    console.log();
    console.log(chalk.red(`ERROR: Unable to locate ${specificPackage} on npm.`));
    console.log();

    // Exit on error
    process.exit(1);

  }

}

// Install packages in destination directory
const installPackage = (destinationPath, verbose, isOnline) => {
  return new Promise((resolve, reject) => {
    const args = [];
    if (verbose) args.push('--verbose');
    if (!isOnline) args.push('--offline');
    const child = spawn('yarnpkg', args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `yarnpkg ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

module.exports = build;
