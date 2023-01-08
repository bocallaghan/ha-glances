const express = require('express')
const app = express()

require('console-stamp')(console, {
    colors: {
        stamp: 'yellow',
        label: 'white'
    },
    extend: {
        debug: 5
    },
    include: ['debug', 'info', 'warn', 'error', 'fatal'],
    level: 'info'
});


const api_server_port = 8125;

const api_path = "/api/";
const api_version = 1;
const api_v1_modules = [
    "speedtest"
];

var modules = {};

function setupModules(){
    api_v1_modules.forEach(mod => {
        console.debug("\tAdding Module: " + mod);
        const moduleFilePath = "./modules/mod_" + mod;
        modules[mod] = require(moduleFilePath);
    });
}

function setupExecutors(){
    api_v1_modules.forEach(mod => {
        console.debug("\tAdding Executor for Module: " + mod);
        const moduleExecutionPath = api_path + api_version + "/" + modules[mod].moduleName + "/execute";
        app.get(moduleExecutionPath, function (req, res) {
            console.debug("\tNew execution request - " + mod);
            try {
                modules[mod].execute();
                console.debug("\t\tExecution complete");
            } catch (error) {
                res.send("Unable to execute module '" + modules[mod].moduleName + "'. " + error);
            }
        });

        // Also run an execution the first time if required.
        if(modules[mod].executesAtLaunch){
            console.debug("\t\tExecute at launch = true");
            modules[mod].execute();
        }
    });
}

function setupEndpoints(){
    api_v1_modules.forEach(mod => {
        const modulePath = api_path + api_version + "/" + modules[mod].moduleName + "/";
        modules[mod].endpoints.forEach(endpoint => {
            console.debug("\tAdding endpoint: " + endpoint + ", for Module: " + mod);
            const mod_endpoint_api_path = modulePath + endpoint;
            app.get(mod_endpoint_api_path, function (req, res) {
                console.debug("\tNew query request - " + mod + "-" + endpoint);
                try {
                    res.send(modules[mod].getData(endpoint));
                    console.debug("\t\tQuery complete");
                } catch (error) {
                    res.send("");
                }
            });
        });
    });
}

console.info("Welcome to the glances API server v0.1");
console.info("Setting up modules");
setupModules();
console.info("Setting up executors");
setupExecutors();
console.info("Setting up endpoints");
setupEndpoints();

app.listen(api_server_port);