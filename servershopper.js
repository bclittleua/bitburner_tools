/** @param {NS} ns **/
export async function main(ns) {
//FYI 25x1pb servers = $1.4t, relatively cheap!
var i = 0; //doesn't necessarily need to be zero...
var ram = 1048576; //1024 = 1.02tb, otherwise powers of 2: 2 4 8 16 32 64 128 256 512 ... 1048576(1pb))
var hn = "420-"; //prefix for server hostname
var owned = ns.getPurchasedServers();
var ownum = owned.length; //convert owned to an integer
var limit = ns.getPurchasedServerLimit(); //can just be 25 rather than a function...
while(ownum < limit){ //works while you have less than 25 (max) servers
for (i = 0; i < limit; ++i) {
await ns.purchaseServer(hn + i, ram); //generates a suffix for server hostname
}
await ns.sleep(1000); //sleep prevents loop lockup
}
ns.tprintf("INFO: Servers owned: " + ownum + "/" + limit);
if (ownum == 25){ns.tprintf(`WARN: You own the max number of servers!`);}
}
