# Glances API Server and modules
An API server designed to support dashboards within a Home Assistant set up where you want to offload some of the statistics gathering to another server.

## Usage
The server will return metrics as requested from one or more modules configured within the server. The server will load and process requests for modules in the `modules` folder. At present, the loading of modules is not dynamic and is based on the list in the variable `api_v1_modules` in the main file.

## Modules
The server is made up of modules which have a number of GET enabled endpoints. For example, the speedtest module has the following GET endpoints:
1. /api/1/speedtest/execute - trigger the execution of a speedtest now
1. /api/1/speedtest/download - get the last seen download speed
1. /api/1/speedtest/upload - get the last seen upload speed
1. /api/1/speedtest/ping - get the last seen ping latency

Every module has an `execute` endpoint to trigger its execution and then a number of data retrieval endpoints.

### Defining data retrieval endpoints
Each module has an attribute called `endpoints` which is an array of strings indicating data that can be retrived. Those strings are used by the server, when data is requested, to call the `module.getData(endpoint)` function to retrieve data.

### Executing the module at first launch
Set the `executesAtLaunch` flag to true or false if you want the module to execute when the server starts up. Otherwise it will need to be manually triggered via the `execute` function before data can be read.
