function createGraphCopy(inputGraph) {
    const newContext = new AudioContext();

    function createNodeCopy(node) {
        const nodeCopy = newContext[`create${node.constructor.name}`]();
        //
    }
    return nodeCopy;
}
export default AudioNodeFunctions;