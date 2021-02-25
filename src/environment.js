var world;

onmessage = function(event) {
    if (event.data.message == "start") {
        postMessage({
            message: "render",
            root: {
                type: "container",
                id: "test",
                foreground: {red: 255, green: 0, blue: 0, alpha: 1},
                children: [
                    {
                        type: "text",
                        text: "Hello, world!"
                    }
                ]
            }
        });

        setTimeout(function() {
            postMessage({
                message: "update",
                root: {
                    id: "test",
                    type: "container",
                    foreground: {red: 255, green: 255, blue: 0, alpha: 1},
                    children: [
                        {
                            type: "text",
                            text: "Working!"
                        }
                    ]
                }
            });
        }, 1000);
    }
}