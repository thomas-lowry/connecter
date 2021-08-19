//count each frame where prototype reactions are added
var count = 0;
//check to see if there are frames on the canvas
//get all elements on the page, filter out all of the frames
//sort frames by slide order
//iterate through frames and add interactions
if (figma.currentPage.children.length > 0) {
    //return all top level frames on the canvas
    let frames = topLevelFrames();
    //sort frames
    let sortedFrames = sortFramesByPosition(frames);
    //connect the frames
    connecter(sortedFrames);
    //PLACEHOLDER
    //set the start node of the first flow
    //this API is not available yet
    //the idea here is that after the frames are connected
    //a flow will be created and start at the first frame
    //close plugin
    figma.closePlugin(count + ' prototyping connections created.');
}
else {
    figma.closePlugin('There are no frames on the page');
}
// This function will iterate through every top level frame
// that would show up in in presentation mode
// if there are no connections a click interaction with
// no transition will be added, if there is already a transition
// ex: a click + smart animate or after delay interaction
// the plugin will skip those frames and leave those interactions in tact
function connecter(slides) {
    slides.forEach((slide, index) => {
        console.log(slide.reactions);
        if (slide.reactions.length === 0) {
            if (index != slides.length) {
                let reactions = [];
                let reaction = reactionGenerator(slides[index + 1].id);
                reactions.push(reaction);
                slide.reactions = reactions;
                count++;
            }
        }
    });
}
// HELPERS
//sorts nodes left to right and then top to bottom (slide order)
function sortFramesByPosition(frames) {
    frames.sort(function (node1, node2) {
        if (node1.y < node2.y)
            return -1;
        if (node1.y > node2.y)
            return 1;
        if (node1.x < node2.x)
            return -1;
        if (node1.x > node2.x)
            return 1;
    });
    return frames;
}
//return a list of top level frames on the current page
function topLevelFrames(page = figma.currentPage) {
    return page.children.filter((node) => node.type === 'FRAME');
}
//return the standard click to advance to next slide prorotype reaction
function reactionGenerator(destinationId) {
    return {
        "action": {
            "type": "NODE",
            "destinationId": destinationId,
            "navigation": "NAVIGATE",
            "transition": null,
            "preserveScrollPosition": false
        },
        "trigger": {
            "type": "ON_CLICK"
        }
    };
}
