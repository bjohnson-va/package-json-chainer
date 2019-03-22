function createGraphNode(name, edges) {

}

function sort(packages) {
    const out = {};
    const pkgNames = packages.map(p => p['name']);
    packages.forEach(pkg => {
        const peerDeps = pkg['peerDependencies'] || [];
        peerDeps.forEach(p => {
            if (!pkgNames.find(n => n === p)) {
                console.log(`${p} is not in the set of packages being considered.  Skipping`)
                return;
            }
            if (out.hasOwnProperty(p)) {
                out[p]['edges'].push(pkg['name']);
            }
        });
        out[pkg['name']] = {
            edges: [],
        }
    });

}

module.exports = sort;
