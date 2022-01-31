/** @param {NS} ns **/
//Found (see urlPrefix) and modified to run every ten minutes, has only failed one contract after hundreds of hours of use.
//This script is purposely spammy in the terminal b/c I like it that way. 
//Feel free to change it, obviously. lol. See bottom of code.

let neverScan = ['home'];
let scanCache = {};
let memory = [];
const urlPrefix = 'https://oat.zone/bitburnercontracts/';

async function sendToServer(ns, type, input, tries) {
type = type.toString();
input = input.toString();
tries = tries || 0;
if (tries > 5) {
throw new Error('Too many failed attempts to talk with remote server');
}
let res = await ns.wget(`${urlPrefix}?type=${encodeURI(type)}&input=${encodeURI(input)}`, '_.txt');
if (!res) {
ns.tprint('failed to connect to remote server; retrying in 2s');
await ns.sleep(2000);
return await sendToServer(ns, type, input, tries + 1);
}

let response = await ns.read('_.txt');
await ns.rm('_.txt');

let parsedResp;
try {
parsedResp = JSON.parse(response);
} catch(err) {
ns.tprint(`error while parsing response ${response}: ${err}; retrying in 2s`);
await ns.sleep(2000);
return await sendToServer(ns, type, input, tries + 1);
}

if (parsedResp.success) {
if (parsedResp.type === type && parsedResp.input === input) {
return parsedResp.output;
} else {
ns.tprint(`something went horribly wrong and we got the wrong response back - expected ${type},${input}, got ${parsedResp.type},${parsedResp.input}; retrying in 2s`);
await ns.sleep(2000);
return await sendToServer(ns, type, input, tries + 1);
}
} else {
if (parsedResp.noHandler) {
return;
}
ns.tprint(`server reported back with error ${parsedResp.error || '[no error]'}; retrying in 2s`);
await ns.sleep(2000);
return await sendToServer(ns, type, input, tries + 1);
}
}



/** @param {NS} ns **/
async function handleContract(ns, hostname, filename) {
let type = ns.codingcontract.getContractType(filename, hostname);
let input = ns.codingcontract.getData(filename, hostname);

input = JSON.stringify(input);

ns.tprint(`INFO: contract ${filename} at ${hostname} of type ${type} w/ data ${input}`);

let output = await sendToServer(ns, type, input);
if (!output) {
ns.tprint(`no handler in place for ${type}`);
return;
}
let correct = ns.codingcontract.attempt(output, filename, hostname);
if (!correct) {
ns.tprint(`SERVER GAVE US THE WRONG RESPONSE`);
throw new Error('I FEEL BETRAYED');
}
ns.tprint(`INFO: solved contract ${filename}!`);
}
//
//
//
/** @param {NS} ns **/
async function lookForContracts(ns, servers) {
for (const server of servers) {
if (neverScan.includes(server)) continue;
if (memory.includes(server)) continue;
memory.push(server);



if (ns.serverExists(server) && ns.hasRootAccess(server)) {
let files = await ns.ls(server);
for (const f of files.filter(f => f.endsWith('.cct'))) {
await handleContract(ns, server, f);
await ns.sleep(500); // give the server a break
}
ns.tprint(`ERROR: No contracts found on ${server}`);
await lookForContracts(ns, scanCache[server] || (scanCache[server] = ns.scan(server)));
}
}
}


/** @param {NS} ns **/
export async function main(ns) {
while(true){
memory = [];
ns.tprint(`WARNING: Scanning for contracts in 5 seconds!`);
await ns.sleep(5000);
ns.tprint(`WARN: SCANNING FOR CONTRACTS...`);
await lookForContracts(ns, ns.scan());
ns.tprint(`WARN: Next scan in 10 minutes.`);
await ns.sleep(600000);
}
}
