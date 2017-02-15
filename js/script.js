    import helper from "./helpers.js";
    import Gantt from "./Gantt.js";
    const GanttInstance = new Gantt();

    // optimize resize throttled
    (function() {
        var throttle = function(type, name, obj) {
            obj = obj || window;
            var running = false;
            var func = function() {
                if (running) { return; }
                running = true;
                 requestAnimationFrame(function() {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        };

        /* init - you can init any event */
        throttle("resize", "optimizedResize");
    })();

    // handle resize event
    window.addEventListener("optimizedResize", function() {
      google.charts.setOnLoadCallback(GanttInstance.drawChart());
    });

    /**
     * Onload functions :
     * -
     */
    window.onload = function() {


    }
