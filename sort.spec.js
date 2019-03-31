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
