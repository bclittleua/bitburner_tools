//This script finds and returns servers that do not have a backdoor installed, for the completionist. ;)

export async function main(ns) {
const servers = getServers(ns);
var todo = 0;

servers.forEach(server => {
if(!(ns.args[0] != undefined && server.depth > ns.args[0]) && server.depth != 0){
const host = server.name;
var pstat = ns.getServer(host).purchasedByPlayer;
var backdoor = ns.getServer(host).backdoorInstalled;
//var hasContract = false;
//ns.ls(host, ".cct").forEach(cct => hasContract = true);
//const baseDashes = hasContract ? "INFO" + "--".repeat((server.depth - 3) * 2) : "----".repeat(server.depth - 1);

if (pstat == false && backdoor == false){
ns.tprintf("> " + host);
ns.tprintf("-Backdoor: " + backdoor);
ns.tprintf("-Rooted: " + (ns.hasRootAccess(host) ? "YES" : "NO"));
todo++;
//ns.tprintf(baseDashes + "--Number of open ports required to NUKE: " + ns.getServerNumPortsRequired(host));
//ns.tprintf(baseDashes + "--RAM: " + ns.getServerMaxRam(host) + ".00GB");
ns.tprintf(" ");
}
}
});

ns.tprintf("Servers that still need a backdoor: " + todo);
if (todo == 0){ns.tprint("ERROR: YOU HAVE BECOME TOO GODLIKE! RENEW! CAROUSEL!")}
}

let svObj = (name = 'home', depth = 0) => ({ name: name, depth: depth });

export function getServers(ns) {
let result = [];
let visited = { 'home': 0 };
let queue = Object.keys(visited);
let name;
while ((name = queue.pop())) {
let depth = visited[name];
result.push(svObj(name, depth));
let scanRes = ns.scan(name);
for (let i = scanRes.length; i >= 0; i--) {
if (visited[scanRes[i]] === undefined) {
queue.push(scanRes[i]);
visited[scanRes[i]] = depth + 1;
}
}
}
return result;
}
