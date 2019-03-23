function partition(array, isValid) {
    return array.reduce(([pass, fail], elem) => {
        return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    }, [[], []]);
}

function sort(packages) {

    return flattenTree([], tree);
}

function buildTree(packages) {
    const tree = {};
    const pkgNames = packages.map(p => p['name']);
    packages.forEach(pkg => {
        const peerDeps = pkg['peerDependencies'] || [];
        const pName = pkg['name'];
        if (!tree.hasOwnProperty(pName)) {
            tree[pName] = {
                users: [],
                isLeaf: true,
            }
        }
        peerDeps.forEach(p => {
            if (!pkgNames.find(n => n === p)) {
                console.log(`${p} is not in the set of packages being considered.  Skipping`);
                return;
            }
            if (tree.hasOwnProperty(p)) {
                tree[p].users.push(pName);
                tree[p].isLeaf = false;
            } else {
                tree[p] = {
                    users: [pName],
                    isLeaf: false,
                }
            }
        });

    });
    return tree;
}

function flattenTree(leaves, tree) {
    if (Object.keys(tree).length === 0) {
        return leaves;
    }
    console.log("Before partition: ", tree);
    const [l, t] = partition(tree, o => o.isLeaf);
    console.log("Leaves: ", l);
    console.log("Tree: ", t);
    return flattenTree(leaves + l, t);
}

export { sort, buildTree };
