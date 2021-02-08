

Object.entries(parsed.unmanaged).forEach((package) => {
    package.forEach((vuln) => {
        if (vuln[0].semver) {
            vuln[0].semver.vulnerable.forEach((semver) => {
                console.log(semver);
            });
        }
    });
});

const arr = [];
Object.entries(parsed.unmanaged).forEach((package) => {
    package.forEach((vuln) => {
        if (typeof vuln === 'object') {
            vuln.forEach((range) => {
                if (range.semver) {
                range.semver.vulnerable.forEach((semver) => {
                        const matchRes = semver.match(/[\[()](.*),(.*)[\])]/);
                        if (matchRes[1]) {
                            //arr.push(matchRes[1]);
                        }
                        if (matchRes[2]) {
                            //arr.push(matchRes[2]);
                        }
                        if (matchRes[1].trim() === '1.6.4;1.7.0_alpha3' || matchRes[2].trim() === '1.6.4;1.7.0_alpha3') {
                            console.log(package);
                        }
                        if (matchRes[1].trim() === '26~rc2' || matchRes[2].trim() === '26~rc2') {
                            console.log(package);
                        }
                    });
                }
            });
        }
    });
});


Object.entries(parsed).forEach((entry) => {
    Object.entries(entry).forEach((package) => {
        package.forEach((vuln) => {
            if (typeof vuln === 'object') {
                vuln.forEach((range) => {
                    if (range.semver) {
                    range.semver.vulnerable.forEach((semver) => {
                            const matchRes = semver.match(/[\[()](.*),(.*)[\])]/);
                            if (matchRes[1]) {
                                libArr.push(matchRes[1]);
                            }
                            if (matchRes[2]) {
                                libArr.push(matchRes[2]);
                            }
                            
                        });
                    }
                });
            }
        });
    });
});




const newLibArr = []
Object.entries(parsed.cocoapods).forEach((package) => {
        package.forEach((vuln) => {
            if (typeof vuln === 'object') {
                vuln.forEach((range) => {
                    if (range.semver) {
                    range.semver.vulnerable.forEach((semver) => {
                            const matchRes = semver.match(/[>][=](.*), <(.*)/);
                            if (matchRes !== null) {
                                if (matchRes[1]) {
                                    newLibArr.push(matchRes[1]);
                                }
                                if (matchRes[2]) {
                                    newLibArr.push(matchRes[2]);
                                }
                            } 
                        });
                    }
                });
            }
        });
});

const upstreamArr = [];
Object.entries(parsed.upstream).forEach((package) => {
    package.forEach((vuln) => {
        if (typeof vuln === 'object') {
            vuln.forEach((range) => {
                if (range.semver) {
                range.semver.vulnerable.forEach((semver) => {
                        const matchRes = semver.match(/[\[()](.*),(.*)[\])]/);
                        if (matchRes !== null) {
                            if (matchRes[1]) {
                                upstreamArr.push(matchRes[1]);
                            }
                            if (matchRes[2]) {
                                upstreamArr.push(matchRes[2]);
                            }
                        } 
                        
                    });
                }
            });
        }
    });
});

const upstreamArrV2 = [];
Object.entries(parsed.unmanaged).forEach((package) => {
    package.forEach((vuln) => {
        if (typeof vuln === 'object') {
            vuln.forEach((range) => {
                if (range.semver) {
                range.semver.vulnerable.forEach((semver) => {
                        const matchRes = semver.match(/[\[()](.*),(.*)[\])]/);
                        if (matchRes[1]) {
                            upstreamArrV2.push(matchRes[1]);
                        }
                        if (matchRes[2]) {
                            upstreamArrV2.push(matchRes[2]);
                        }
                    });
                }
            });
        }
    });
});





const mavenSemver = require('@snyk/maven-semver');

try {
    mavenSemver.valid('1.2.3');
} catch (err) {
    console.log('it was invalid:', err);
}

mavenSemver.valid('abcdefg')

