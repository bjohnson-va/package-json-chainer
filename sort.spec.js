import {sort, buildTree} from './sort';

test('sort should return an empty list unchanged', () => {
    const actual = sort([]);
    const expected = [];
    expect(actual).toEqual(expected);
});

test('sort should return a single item unchanged', () => {
    const pkg = {
        name: "name",
    };
    const actual = sort([pkg]);
    const expected = [pkg.name];
    expect(actual).toEqual(expected);
});

test('sort should put dependency first (2 packages already in correct order)', () => {
    const pkgWithDeps = {
        name: "HASDEPS",
        peerDependencies: [
            "DEP",
        ],
    };
    const depPkg = {
        name: "DEP",
        peerDependencies: [],
    };
    const actual = sort([depPkg, pkgWithDeps]);
    const expected = [depPkg.name, pkgWithDeps.name];
    expect(actual).toEqual(expected);
});

test('sort should put dependency first (2 packages already in wrong order)', () => {
    const pkgWithDeps = {
        name: "HASDEPS",
        peerDependencies: [
            "DEP",
        ],
    };
    const depPkg = {
        name: "DEP",
        peerDependencies: [],
    };
    const actual = sort([pkgWithDeps, depPkg]);
    const expected = [depPkg.name, pkgWithDeps.name];
    expect(actual).toEqual(expected);
});

test('sort should put dependencies first in M shaped graph', () => {
    // This is the scenario where there are 2 dependencies and 3 users, their
    // relationship is shaped like an M
    const dep1 = {
        name: "DEP1",
        peerDependencies: [],
    };
    const dep2 = {
        name: "DEP2",
        peerDependencies: [],
    };
    const user1 = {
        name: "U1",
        peerDependencies: ["DEP1"],
    };
    const user2 = {
        name: "U2",
        peerDependencies: ["DEP1", "DEP2"],
    };
    const user3 = {
        name: "U3",
        peerDependencies: ["DEP2"],
    };
    const actual = sort([dep1, dep2, user1, user2, user3]);
    expect(actual.indexOf("DEP1")).toBeLessThan(actual.indexOf("U1"));
    expect(actual.indexOf("DEP1")).toBeLessThan(actual.indexOf("U2"));
    expect(actual.indexOf("DEP1")).toBeLessThan(actual.indexOf("U3"));
    expect(actual.indexOf("DEP2")).toBeLessThan(actual.indexOf("U1"));
    expect(actual.indexOf("DEP2")).toBeLessThan(actual.indexOf("U2"));
    expect(actual.indexOf("DEP2")).toBeLessThan(actual.indexOf("U3"));
});

test('sort should put dependencies first in X shaped graph', () => {
    // This is the scenario where there are 2 dependencies and 1 users "U", and
    // then 2 users of U.
    const deepDep1 = {
        name: "DEEPDEP1",
        peerDependencies: [],
    };
    const deepDep2 = {
        name: "DEEPDEP2",
        peerDependencies: [],
    };
    const dep = {
        name: "DEP",
        peerDependencies: ["DEEPDEP1", "DEEPDEP2"],
    };
    const user1 = {
        name: "U1",
        peerDependencies: ["DEP"],
    };
    const user2 = {
        name: "U2",
        peerDependencies: ["DEP"],
    };
    const actual = sort([deepDep1, deepDep2, dep, user1, user2]);
    expect(actual.indexOf("DEEPDEP1")).toBeLessThan(actual.indexOf("DEP"));
    expect(actual.indexOf("DEEPDEP2")).toBeLessThan(actual.indexOf("DEP"));
    expect(actual.indexOf("DEP")).toBeLessThan(actual.indexOf("U1"));
    expect(actual.indexOf("DEP")).toBeLessThan(actual.indexOf("U2"));
});

test('sort should put dependencies first in I shaped 3-node graph', () => {
    // This is the scenario where there is 1 dependency and 1 user "U", and then
    // another user of U.
    const deepDep = {
        name: "DEEPDEP",
        peerDependencies: [],
    };
    const dep = {
        name: "DEP",
        peerDependencies: ["DEEPDEP"],
    };
    const user = {
        name: "U",
        peerDependencies: ["DEP"],
    };
    const actual = sort([deepDep, dep, user]);
    expect(actual.indexOf("DEEPDEP")).toBeLessThan(actual.indexOf("DEP"));
    expect(actual.indexOf("DEP")).toBeLessThan(actual.indexOf("U"));
});

test('buildTree should build correct tree for 2 packages with 1 dependency relationship', () => {
    const pkgWithDeps = {
        name: "HASDEPS",
        peerDependencies: [
            "DEP",
        ],
    };
    const depPkg = {
        name: "DEP",
        peerDependencies: [],
    };
    const actual = buildTree([depPkg, pkgWithDeps]);
    const expected = {
        'DEP': {
            users: ['HASDEPS'],
            isLeaf: false,
        },
        'HASDEPS': {
            users: [],
            isLeaf: true,
        },
    };
    expect(actual).toEqual(expected);
});

test('buildTree should build correct tree for 2 packages with 1 dependency relationship', () => {
    const pkgWithDeps = {
        name: "HASDEPS",
        peerDependencies: [
            "DEP",
        ],
    };
    const depPkg = {
        name: "DEP",
        peerDependencies: [],
    };
    const actual = buildTree([depPkg, pkgWithDeps]);
    const expected = {
        'DEP': {
            users: ['HASDEPS'],
            isLeaf: false,
        },
        'HASDEPS': {
            users: [],
            isLeaf: true,
        },
    };
    expect(actual).toEqual(expected);
});

test('buildTree should build correct tree for 3 packages with 2 linear relationships', () => {
    const pkgWithDeps = {
        name: "HASDEPS",
        peerDependencies: [
            "DEP",
        ],
    };
    const pkg2WithDeps = {
        name: "DEP",
        peerDependencies: [
            "DEEPDEP",
        ],
    };
    const depPkg = {
        name: "DEEPDEP",
        peerDependencies: [],
    };
    const actual = buildTree([depPkg, pkgWithDeps, pkg2WithDeps]);
    const expected = {
        'DEEPDEP': {
            users: ['DEP'],
            isLeaf: false,
        },
        'DEP': {
            users: ['HASDEPS'],
            isLeaf: false,
        },
        'HASDEPS': {
            users: [],
            isLeaf: true,
        },
    };
    expect(actual).toEqual(expected);
});

test( 'buildTree should build correct tree for 3 packages with in binary relationship', () => {
    const pkgWithDeps = {
        name: "HASDEPS",
        peerDependencies: [
            "DEP",
        ],
    };
    const pkg2WithDeps = {
        name: "HASDEPS2",
        peerDependencies: [
            "DEP",
        ],
    };
    const depPkg = {
        name: "DEP",
        peerDependencies: [],
    };
    const actual = buildTree([depPkg, pkgWithDeps, pkg2WithDeps]);
    const expected = {
        'HASDEPS2': {
            users: [],
            isLeaf: true,
        },
        'DEP': {
            users: ['HASDEPS', 'HASDEPS2'],
            isLeaf: false,
        },
        'HASDEPS': {
            users: [],
            isLeaf: true,
        },
    };
    expect(actual).toEqual(expected);
});
