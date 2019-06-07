const argRegex = /--(?=(.+))/;
function getArgs(argName) {
    const { cArgs } = getArgsData();
    if (argName) {
        return cArgs[argName];
    }
    return cArgs;
}

function getArgsList() {
    const { cArgsList } = getArgsData();
    return cArgsList;
}

function hasArgs(argName) {
    return (argName in getArgs());
}

function getArgsData() {
    const rawArgs = process.argv,
        cArgs = {},
        cArgsList = [],
        argsArray = rawArgs.filter((arg) => argRegex.test(arg));
    argsArray.forEach((arg) => {
        const argMap = arg.match(argRegex)[1].split("=");
        cArgs[argMap[0]] = argMap[1] || "";
        cArgsList.push(argMap[0]);
    });
    return { cArgs, cArgsList };
}

exports.getArgs = getArgs;
exports.hasArgs = hasArgs;
exports.getArgsList = getArgsList;
