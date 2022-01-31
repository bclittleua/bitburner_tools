/** @param {NS} ns **/
//Checks target server to see if a backdoor is installed, similar to bdcheck.js.

export async function main(ns) {
if (ns.getServer(ns.args[0]).backdoorInstalled == 1){ns.tprint("INFO: backdoor installed!")}else{ns.tprint("WARN: no backdoor, get it!")};
}
