/** @param {NS} ns **/
//Found. Requires hackservers.js
//Propagates through network, roots all possible servers, copies self and hackservers.js,
//then eventually runs hackservers.js on up to 5 target servers. Fucking Brilliant!
//PROTIP: create an alias for target groups, i.e. <alias -g group5="ecorp megacorp kuai-gong omnitek nwo">
//THEN: <worm group5> to start the process

export async function main(ns) {
//ns.tail(); //toggle a log window on start for debug

//if no arguments provided tell the user how to use script.
if (ns.args.length === 0) {
ns.alert("Please include one or more arguments as server names to hack. The script will propogate across all servers and grow, weaken and hack the specified targets. As you get new hacking tools, kill all scripts and rerun from home.");
return;
}
var ogArgs = ns.args;
ns.toast('Running worm on ' + ns.getHostname());
var hostservers = ns.scan(ns.getHostname()); //get all servers you can connect to
var scriptram = ns.getScriptRam('worm.js', 'home'); //get ram for this script
var hackscriptram = ns.getScriptRam('hackservers.js', 'home'); //get ram for hack script
var avsram = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) + scriptram; //get available server ram for this server
var hsthreads = Math.floor(avsram / hackscriptram); //calculate usethreads for hack script for this server
var randomSleep = getRndInteger(60000,300000); //used to stagger interval of breeding/propogation

await attackAll(hostservers,ns.getHostname());

if (hsthreads) { //if usethreads exists for this script, build args array of parameters based on this scripts args
var hsargs = [];
for (const argument of ns.args) {
hsargs.push(argument);
hsargs.push(ns.getServerMinSecurityLevel(argument));
hsargs.push(ns.getServerMaxMoney(argument));
hsargs.push(ns.getServerRequiredHackingLevel(argument));
}
if (ns.getHostname() != 'home') { //copy hack script to this server and spawn script with threads and arguments as a single string
await ns.scp('hackservers.js', ns.getHostname(), 'home');
}
ns.spawn('hackservers.js', hsthreads, hsargs.toString());
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function attack(server) {
var hacktoolnum = 0; //count and use hack tools owned if you don't have root
if (!ns.hasRootAccess(server)) {
ns.toast('Opening ports on ' + server);
if (ns.fileExists('BruteSSH.exe', 'home')) {
ns.brutessh(server);
hacktoolnum++;
}
if (ns.fileExists('FTPCrack.exe', 'home')) {
ns.ftpcrack(server);
hacktoolnum++;

}
if (ns.fileExists('relaySMTP.exe', 'home')) {
ns.relaysmtp(server);
hacktoolnum++;

}
if (ns.fileExists('HTTPWorm.exe', 'home')) {
ns.httpworm(server);
hacktoolnum++;

}
if (ns.fileExists('SQLInject.exe', 'home')) {
ns.sqlinject(server);
hacktoolnum++;

}
}
if (ns.getServerNumPortsRequired(server) <= hacktoolnum && !ns.hasRootAccess(server)) {
ns.toast("nuking " + server);
ns.nuke(server);
}
if (!ns.hasRootAccess(server)) {
ns.toast("unable to gain root to " + server, "error");
}
}

async function worm(server) {
//copy WORM script to server and run
//if (!ns.fileExists('worm.js', server)) {  NOTE: disabled for now to ensure most current version of worm is being bred
ns.print('worm.js being copied to ' + server);
await ns.scp('worm.js', server, 'home');
//}
//if you don't see either script running on target server, run worm on it.
if (!ns.scriptRunning('worm.js', server) && !ns.scriptRunning('hackservers.js', server)) {
ns.print('running worm on ' + server);
await ns.sleep(3000); 
await ns.scp('worm.js', server, 'home');
ns.exec('worm.js', server, 1, ...ogArgs);
await ns.sleep(randomSleep); //randomly stagger breeding interval
}
}

async function attackAll(servers,host) {
for (const server of servers) {
await attack(server);
if (ns.getServerMaxRam(server) >= ns.getServerUsedRam(server) + scriptram) { //if the server has enough ram to run the worm script
await worm(server);
} else { //if server can't run script, look at servers it can connect to, gain root, and run script there
var moreservs = ns.scan(server);
moreservs.splice(moreservs.indexOf(host),1);
await attackAll(moreservs,server);

}
}
}

}
