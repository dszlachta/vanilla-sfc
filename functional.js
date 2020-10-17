export function identity(something) {
    return something;
}

export function pipe(...pipedFunctions) {
    return function executePipe(argument) {
        return pipedFunctions
            .reduce(
                (previousResult, currentFunction) => currentFunction(previousResult),
                argument
            );
    };
}
