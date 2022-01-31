/** @param {NS} ns **/
export async function main(ns) {
ns.tprint("WARN: Deleting all servers in 10 seconds, you'd better abort if you didn't mean to do this!");
await ns.sleep (10000);
ns.tprint("WARN: Have it your way, deleting all your servers now...");
var currentServers = ns.getPurchasedServers();
for (var i = 0; i < currentServers.length; ++i) {
var serv = currentServers[i];
ns.killall(serv);
ns.deleteServer(serv);
}
ns.tprint("Done! I hope you meant to do that, rofl.");
}
