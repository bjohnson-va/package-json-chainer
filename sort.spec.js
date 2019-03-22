const sort = require('./sort');

test('should return an empty list unchanged', () => {
    const actual = sort([]);
    const expected = [];
    expect(actual).toEqual(expected);
});

test('should return a single item unchanged', () => {
    const pkg = {
        name: "name",
    };
    const actual = sort([pkg]);
    const expected = [pkg];
    expect(actual).toEqual(expected);
});

test('should put dependency first (2 packages already in correct order)', () => {
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
    const expected = [depPkg, pkgWithDeps];
    expect(actual).toEqual(expected);
});

test('should put dependency first (2 packages already in wrong order)', () => {
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
    const expected = [depPkg, pkgWithDeps];
    expect(actual).toEqual(expected);
});
