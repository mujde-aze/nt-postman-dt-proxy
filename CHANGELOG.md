# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2023-01-07

### Fixed
- Fixed breaking change from the update of firebase-functions.

## [2.1.1] - 2023-01-07

### Changed
- Updated dependencies

## [2.1.0] - 2022-10-03

### Changed
- Updated dependencies.

## [2.0.2] - 2022-03-06

### Changed
- Regular dependency patches.

## [2.0.1] - 2022-03-06

### Added
- Alphanumeric `From` address in SMS

## [2.0.0] - 2022-03-05

### Added
- Integrated Twilio for SMS support

## [1.4.9] - 2022-01-31

### Changed
- No need to lookup activity. This should speed things up a bit.

## [1.4.8] - 2022-01-30

### Changed
- Reverting to processing requests individually for now

## [1.4.5] - 2022-01-30

### Fixed
- Batch promises when retrieving contacts

## [1.4.4] - 2022-01-30

### Changed
- Limit concurrent requests to WP by 10

## [1.4.3] - 2022-01-30

### Changed
- Process contact activities serially to see if it alleviates the timeout problem

## [1.4.2] - 2022-01-30

### Fixed
- Bug where contact phone and contact address were always assumed to be present

## [1.4.1] - 2022-01-30

### Added
- More verbose logging

## [1.4.0] - 2022-01-12

### Changed
- Updated a bunch of dependent libraries

## [1.3.4] - 2021-10-13

### Changed
- Added release action to CD pipeline

## [1.3.3] - 2021-10-13

### Changed
- Updated Jest, Typescript and other dev dependencies
- Axios requests now return a typed object to address breaking changes with Typescript >4.0

## [1.3.2] - 2021-08-29

### Changed
- Used Promise.all to resolve the `getContactActivities` queries, hopefully should speed up execution

## [1.3.1] - 2021-08-28

### Added
- Debug logging

### Removed
- Update milestone cloud function is no longer needed

## [1.3.0] - 2021-08-27

### Added
- Call API to retrieve the time that the `need_nt` status was set

## [1.2.3] - 2021-08-25

### Changed
- Move whitelist to environment config

## [1.2.2] - 2021-08-25

### Changed
- Only users in whitelist should be able to see all contacts requiring NTs

## [1.2.1] - 2021-08-23

### Added
- Readme and Changelog

### Changed
- 'Has Bible' status will be assigned when the status is changed to 'nt_sent'
- Updated unit tests

## [1.2.0] - 2021-08-21

### Added
- Functionality to retrieve contacts and update postage status.
- Check authentication attributes before interacting with API.


[3.0.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v2.1.1...v3.0.0
[2.1.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.9...v2.0.0
[1.4.9]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.8...v1.4.9
[1.4.8]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.5...v1.4.8
[1.4.5]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.4...v1.4.5
[1.4.4]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.4...v1.4.0
[1.3.4]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.0...HEAD
