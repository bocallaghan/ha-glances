const speedTest = require('speedtest-net');

var latestResults = {
    "upload": null,
    "download": null,
    "ping": null
};

exports.moduleName = "speedtest";
exports.executesAtLaunch = true;
exports.endpoints = [
    "download",
    "upload",
    "ping"
]

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

async function runSpeedtest(serverNumber){    
    try {
        console.debug("Speedtest execution starting");
        var speedtestResults = await speedTest({
            "serverId": ("" + serverNumber),
            acceptLicense: true,
            acceptGdpr: true
        });
        console.debug("Test completed");
        console.debug(speedtestResults);
        latestResults.upload = formatBytes(speedtestResults.upload.bytes,2);
        latestResults.download = formatBytes(speedtestResults.download.bytes,2);
        latestResults.ping = speedtestResults.ping.latency + " ms";
        console.debug("Speedtest execution completed");
    } catch (error) {
        console.error("Speedtest execution failed");
        console.error("Unexpected output from command: ", error);
    }
}

function execute(){
    runSpeedtest(2432);
}

function getData(query){
    return latestResults[query];
}

exports.execute = execute;
exports.getData = getData;

