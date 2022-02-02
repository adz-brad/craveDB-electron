# craveDB
### LAN Server / Database Manager for cravePOS

#### Built with:

- NodeJS
- Electron
- Apollo GraphQL
- MongoDB Realm


### Overview

craveDB is a key component in the craveRMS application suite and the heartbeat of the cravePOS point-of-sale system. Packaged for Windows / macOS / Linux using Electron, users can start, stop and restart the server and manage their restaurant database.  

### Design

On initial startup, users enter their API key / App ID which is saved to local storage. If this data already exists, users can validate app entry using a pin stored in the local MongooDB Realm database. On the main screen, users can choose to Start, Stop or Restart the Apollo GraphQL server (accessed by all cravePOS devices with the server endpoint) that performs CRUD updates to the local database. When changes are made and a network connection is present, data is asynchronously updated from the local database to the cloud, which is vital for remote asset management and metric evaluation via the craveHQ app.

### Future

- Full front-end redesign
- Logging tools for debugging and error management
- Access to client support portal via craveRMS web app
