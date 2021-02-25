const THING_TYPE_LOOKUP = {
    container: "div"
};

const THING_POSITION_CSS_POSITION_LOOKUP = {
    float: "absolute",
    inline: "static",
    newline: "static",
    invisible: "static"
};

const THING_POSITION_CSS_DISPLAY_LOOKUP = {
    float: "block",
    inline: "inline-block",
    newline: "block",
    invisible: "none"
};

window.addEventListener("load", function() {
    var environment = new Worker("/src/environment.js");

    function renderThing(thingRepresentation) {
        var thingElement;

        if (thingRepresentation.type == "text") {
            thingElement = document.createTextNode(thingRepresentation.text);

            return thingElement;
        } else {
            thingElement = document.createElement(THING_TYPE_LOOKUP[thingRepresentation.type] || "container");
        }

        thingElement.id = thingRepresentation.id;

        for (var property in thingRepresentation) {
            switch (property) {
                case "position":
                    thingElement.style.position = THING_POSITION_CSS_POSITION_LOOKUP[thingRepresentation[property]] || THING_POSITION_CSS_POSITION_LOOKUP["float"];
                    thingElement.style.display = THING_POSITION_CSS_DISPLAY_LOOKUP[thingRepresentation[property]] || THING_POSITION_CSS_DISPLAY_LOOKUP["float"];
                    break;

                case "x":
                    thingElement.style.left = `${Number(thingRepresentation[property]) || 0}px`;
                    break;

                case "y":
                    thingElement.style.top = `${Number(thingRepresentation[property]) || 0}px`;
                    break;

                case "width":
                    thingElement.style.width = `${Number(thingRepresentation[property]) || 100}px`;
                    break;

                case "height":
                    thingElement.style.height = `${Number(thingRepresentation[property]) || 100}px`;
                    break;

                case "rotation":
                    thingElement.style.transform = `rotate(${Number(thingRepresentation[property]) || 0}deg)`;
                    break;

                case "background":
                case "foreground":
                case "border":
                    var red, green, blue, alpha;

                    red = Number(thingRepresentation[property].red) || 0;
                    green = Number(thingRepresentation[property].green) || 0;
                    blue = Number(thingRepresentation[property].blue) || 0;
                    alpha = Number(thingRepresentation[property].alpha) || 0;

                    property == "background" && (thingElement.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`);
                    property == "foreground" && (thingElement.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`);
                    property == "border" && (thingElement.style.border = `${thingRepresentation[property].thickness || 1}px solid rgba(${red}, ${green}, ${blue}, ${alpha})`);

                    break;

                case "rounding":
                    thingElement.style.borderTopLeftRadius = `${Number(thingRepresentation[property].tl) || 0}px`;
                    thingElement.style.borderTopRightRadius = `${Number(thingRepresentation[property].tr) || 0}px`;
                    thingElement.style.borderBottomLeftRadius = `${Number(thingRepresentation[property].bl) || 0}px`;
                    thingElement.style.borderBottomRightRadius = `${Number(thingRepresentation[property].br) || 0}px`;
                    break;

                case "opacity":
                    thingElement.style.opacity = Number(thingRepresentation[property].opacity) || 0;
                    break;
            }
        }

        for (var child in thingRepresentation.children || []) {
            thingElement.appendChild(renderThing(thingRepresentation.children[child]));
        }

        return thingElement;
    }

    environment.onmessage = function(event) {
        if (event.data.message == "render") {
            requestAnimationFrame(function() {
                document.body.innerHTML = "";

                document.body.appendChild(renderThing(event.data.root || {}));
            });
        } else if (event.data.message == "update") {
            document.getElementById(event.data.root.id).replaceWith(renderThing(event.data.root || {}));
        }
    };

    environment.postMessage({
        message: "start"
    });
});