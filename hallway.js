//Something fun I came up with: returns all servers with a backdoor, but adds a tiny bit of a story element.
export async function main(ns) {
ns.tprint("You look down a virtual hallway for another exit and see...")
const servers = getServers(ns);
var opened = 0;
servers.forEach(server => {
if(!(ns.args[0] != undefined && server.depth > ns.args[0]) && server.depth != 0){
const host = server.name;
var pstat = ns.getServer(host).purchasedByPlayer;
var backdoor = ns.getServer(host).backdoorInstalled;
if (pstat == false && backdoor == true){
ns.tprintf("> " + host);
opened++;
ns.tprintf(" ");
}
}
});
if (opened == 0){ns.tprint("...nothing.")}
ns.tprintf("You see " + opened +" doors opened before you.");
if (opened == 0){ns.tprint("ERROR: You walk up and down the virtual hallway, but the walls are blank.")}
if (opened == 68){ns.tprint("WARN: All of the doors are open and the hallway is flooded with light. Is it time to ascend?")}
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
