function partition(array, isValid) {
    return array.reduce(([pass, fail], elem) => {
        return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    }, [[], []]);
}

function sort(packages) {
    if (packages.length === 0) {
        return [];
    }

    const tree = buildTree(packages);
    const out = [];

    do {
        let key = Object.keys(tree)[0];
        while (!!key) {
            const node = tree[key];
            if (!node) {
                break;
            }

            delete tree[key];
            if (node.isLeaf) {
                out.push(key);
                break;
            } else {
                out.unshift(key);
            }
            key = node.users[0];
        }
    } while (Object.keys(tree).length > 0);
    return out;

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
