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
