# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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


[1.3.3]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/mujde-aze/nt-postman-dt-proxy/compare/v1.2.0...HEAD
