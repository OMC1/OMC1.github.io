/**
 *  Use: <a-animation begin="devicedown"></a-animation>
 */
var deviceUpDown = {
  options: {
    element: document.querySelector('a-circle.shopcart'), // window;
    upTarget: 20, // percent from top of window (0 - 100);
    downTarget: 30 // percent from top of window (0 - 100);
  },
  init: function(){
    var gamma;// -90 to 90
    var beta; // -180 to 180
    var alpha; // 0 to 360
    var start = false;
    var dir = 0; // -1 = 'down', 0 = 'none', 1 = 'up'
    var dirEnum = {};
    var currPos; // Current position in percent (from top to bottom of window).
    var prevPos; // Previous position.
    var tolerance = 1; // Percent difference to register movement.
    var upTarget = deviceUpDown.options.upTarget || 20;
    var downTarget = deviceUpDown.options.downTarget || 70;
    var upFired = false;
    var downFired = false;
    var upEvent = document.createEvent('Event');
    var downEvent = document.createEvent('Event');
    var element = deviceUpDown.options.element;

    upEvent.initEvent('deviceup', true, true);
    downEvent.initEvent('devicedown', true, true);

    function handleOrientation(event) {
      // Point phone down and dot goes up, until device flip.
      beta = event.beta > 90 ? 90 : event.beta < 0 ? 0 : event.beta;
      gamma = event.gamma < 0 && event.gamma > -90 ? event.gamma + 90 : 0;
      alpha = event.alpha;

      if (!start) {
        start = true;
        setInterval(function() {
          var up;
          var down;
          if (window.matchMedia("(orientation: portrait)").matches) {
            currPos = 100 - 100 * (beta / 90);
          } else if (window.matchMedia("(orientation: landscape)").matches) {
            currPos = 100 * (gamma / 90);
          }

          if (prevPos === undefined) {
            prevPos = currPos;
            dir = 0;
          } else if (currPos > (prevPos + tolerance)) {
            dir = -1;
            prevPos = currPos;
          } else if (currPos < (prevPos - tolerance)) {
            dir = 1;
            prevPos = currPos;
          } else {
            dir = 0;
          }

          if (dir == 1 && currPos <= upTarget && !upFired) {
            upFired = true;
            downFired = false;
            element.dispatchEvent(upEvent);
            alert("Up fired");
          }

          if (dir == -1 && currPos >= downTarget && !downFired) {
            downFired = true;
            upFired = false;
            element.dispatchEvent(downEvent);
          }
        }, 100);
      }
    }

    window.addEventListener('deviceorientation', handleOrientation);
  }
};

deviceUpDown.init();
