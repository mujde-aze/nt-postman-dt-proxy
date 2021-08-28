# NT Postman - DT Proxy

Proxy requests from the postman view to the DT API.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
- [Running the tests](#running-the-tests)
    - [And coding style tests](#and-coding-style-tests)
- [Branching Model](#branching-model)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Versioning](#versioning)
- [Issue Tracking](#issue-tracking)
- [Documentation](#documentation)
    - [Project Documentation](#project-documentation)
    - [Recommended Reading](#recommended-reading)
- [Authors](#authors)

## Overview

These functions are responsible for retrieving and updating contacts through the DT API.

## Getting Started

### Prerequisites

If running locally, consider using the [Firebase emulator](https://firebase.google.com/docs/emulator-suite/connect_auth) to run these functions locally.
But before running the emulator, be sure to compile TS first with `npm run build`.

### Installing

Installing is the responsibility of the CI/CD pipeline. Push a tag and the Github action will do the rest.

## Running the tests

To run the tests, issue `npm run test`.

## Branching Model
We use [GitHubFlow](https://guides.github.com/introduction/flow/) for this project.

## Deployment

The CI/CD pipeline takes care of deployment once you create a [semver](https://semver.org/) compliant tag.

## Built With

* [Firebase](https://firebase.google.com/) - Authentication

## Versioning

We use [Semantic Versioning](http://semver.org/).

## Issue Tracking

Issues are tracked in this project's issue tracker.

## Documentation

### Project Documentation

* [Github Project](https://github.com/orgs/mujde-aze/projects)

### Recommended Reading

* [Firebase callable functions](https://firebase.google.com/docs/functions/callable)
* [Enabling App Check enforcement](https://firebase.google.com/docs/app-check/cloud-functions)
* [Functions environment configuration](https://firebase.google.com/docs/functions/config-env)

## Authors

* **Crafton Williams** - *Initial work*
