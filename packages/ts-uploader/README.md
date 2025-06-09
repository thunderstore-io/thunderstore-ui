# ts-uploader

Handles file uploads to various Thunderstore APIs

## Specs

### High level overview

The Thunderstore API has several kinds of file upload handling endpoints. This
library should provide an easily consumable interface for uploading files (or
data otherwise) to any of those endpoints, however with as little coupling to
external components as possible.

This package should also take care of all the difficult logic around error
handling, retries, bandwidth management, checksum generation, etc. as much as possible.

### Related packages

| Package                                             | Description                                                 |
|-----------------------------------------------------|-------------------------------------------------------------|
| **ts-uploader**                                     | Responsible for implementing the file upload business logic |
| [ts-uploader-react](../ts-uploader-react/README.md) | Responsible for providing React wrappers for `ts-uploader`  |

### Requirements

This library should:

| Requirement                                                                      | Status |
|----------------------------------------------------------------------------------|--------|
| Provide functionality for handling single-part file uploads to Thunderstore APIs | ❌      |
| Provide functionality for handling multi-part file uploads to Thunderstore APIs  | ❌      |
| Handle known error scenarios as gracefully as possible                           | ❌      |
| Support retries for uploads                                                      | ❌      |
| Support pausing and resuming of multi-part uploads                               | ❌      |
| Function in unreliable network conditions (i.e. packet loss or high latency)     | ❌      |
| Function for low-bandwidth clients                                               | ❌      |
| Provide upload progress information                                              | ❌      |
| Provide upload speed metrics                                                     | ❌      |
| Provide upload status change events                                              | ❌      |
| Support upload integrity headers (checksum generation)                           | ❌      |

### Architecture

#### Exported features

| Exported feature                 | Description                                                                    |
|----------------------------------|--------------------------------------------------------------------------------|
| Create file upload (multipart)   | Creates a new multipart **File upload handle**                                 |
| Create file upload (single part) | Creates a new single part **File upload handle**                               |
| File upload handle (interface)   | A common interface used to represent an ongoing file upload regardless of type |

## Development

### Scripts

- `yarn run build`: Builds the project
- `yarn run dev`: Builds the project & watches files for changes, triggering a rebuild


### Testing

The test suite expects a Thunderstore backend environment to be running and
access to it configured.

Make sure the following conditions are filled:

1. The `TS_API_DOMAIN` environment variable points to a Thunderstore instance.
2. The `TS_API_AUTHORIZATION` environment variable is a valid `Authorization`
header value on the Thunderstore instance the `TS_API_DOMAIN` points to.
3. The DNS names of the configured environment _and_ storage backend are
accessible by node. This might not be the case by default, as the backend dev
environment setup instructions assume the browser to handle localhost subdomains
rather than instructing system-wide configuration for them.

If using the local backend dev environment, you will most likely need to
configure local DNS rules that map `thunderstore.localhost` to `127.0.0.1` and
then set `http://thunderstore.localhost` as your `TS_API_DOMAIN` value.

Additionally, for some reason jsdom XMLHttpRequest will fail to make proper
requests to the `localhost:9000` domain (which is what the backend dev env will
use by default for s3 pre-signed URL generation), so you might need to change
the `USERMEDIA_S3_SIGNING_ENDPOINT_URL` to e.g.
`http://thunderstore.localhost:9000/` or something else which is accessible by
jsdom.
