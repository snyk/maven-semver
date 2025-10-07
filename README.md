[![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)](https://snyk.io)
***

# maven-semver

A semantic version parser for maven, based on the API of [npm's semver](https://www.npmjs.com/package/semver).

Additional functionality, beyond what is documented in npm's, is available:

##### `compareRanges`

This facilitates sorting version ranges, which may help with generating consistent/normalised data,
and may help work around bugs in Maven's version parser. It compares as follows (see [#19](https://github.com/snyk/maven-semver/pull/19)):

 * The operators are interpreted as "just outside", so `(1,2]` > `[1,2]`. (Read `(1` as `[1.000001`?)
 * Singular versions are sorted before ranges: `[2]` < `[2,3)`.
 * The minimum/singular version is more important than the maximum. `[2]` > `[1,3)`
 * Open-ended ranges are further out than any named version: `(,2)` < `(0.0.1,2)`, `[1,3)` < `[1,)`.

### Further reading
 * https://octopus.com/blog/maven-versioning-explained
 * https://cwiki.apache.org/confluence/display/MAVENOLD/Versioning
 * https://maven.apache.org/pom.html#version-order-testing


### License

[License: Apache License, Version 2.0](LICENSE)

**This repository is closed to public contributions.**
