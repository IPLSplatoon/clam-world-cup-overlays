# clam-world-cup-overlays

Broadcast overlays for Inkling Performance Labs' English language broadcast of the [Clam World Cup](https://twitter.com/ClamWorldCup).  
IPLの[クラムW杯](https://twitter.com/ClamWorldCup)の海外放送のためにストリームオーバーレイ。

## Setup

- Set up `ipl-overlay-controls` using the [installation guide.](https://github.com/inkfarer/ipl-overlay-controls#readme)

### Pre-built version (For production use)

- Clone the `build` branch of this repository to `[nodecg]/bundles/clam-world-cup-overlays`
- All done!

### Build manually

- Ensure you have access to the private GSAP registry: [Guide](https://greensock.com/docs/v3/Installation#private)
- Insert your GSAP API key into the `.npmrc` file. DO NOT commit this to git!
- Clone this repository to `[nodecg]/bundles/clam-world-cup-overlays`
- Install dependencies: `npm i`
- Run build: `npm run build`

#### Other npm commands

- `build`: Create a production-ready build.
- `build:dev`: Create a development build with better debugging options.
- `build:clean`: Combines `build` and `clean` tasks.
- `clean`: Removes built files.
- `start`: Starts NodeCG.
- `watch`: Runs a build and rebuilds when changes are found.
- `lint`: Checks for linter errors
- `fix`: Automatically fixes some linter errors
- `schema-types`: Create or update type definitions for replicant schemas found in the `schemas` directory

## CI

This repository includes a GitHub Actions script that automatically lints and builds the overlays.
It requires two secrets to function:

- `GH_SSH`: An SSH key with permissions to push to the package's GitHub repository. Used for pushing the build result.
- `GSAP_AUTH`: The GSAP authorization token, used to pull packages from npm.
