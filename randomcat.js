/** @param {NS} ns **/
// run with this alias: alias -g kitty="run randomcat.js;cat kitty.txt"
// fetches and displays a random cat image, lol.

export async function main(ns) {
await ns.wget("https://api.thecatapi.com/v1/images/search?mim_types=gif", "json.txt"); //remove the ?mim_types=gif or change to png
var content = await ns.read("json.txt");
var url = JSON.parse(content)[0]["url"];
await ns.write("kitty.txt", `<html><body><img src=\"${url}\"></img></body></html>`, "w");
}
