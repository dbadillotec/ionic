(function(document, ionic) {
  'use strict';

  var queueElements = {};   // elements that should get an active state in XX milliseconds
  var activeElements = {};  // elements that are currently active
  var keyId = 0;            // a counter for unique keys for the above ojects
  var ACTIVATED_CLASS = 'activated';

  ionic.activator = {

    start: function(e) {
      var self = this;

      // when an element is touched/clicked, it climbs up a few
      // parents to see if it is an .item or .button element
      ionic.requestAnimationFrame(function(){
        if (tapRequiresNativeClick(e.target)) return;
        var ele = e.target;
        var eleToActivate;

        for(var x=0; x<4; x++) {
          if(!ele || ele.nodeType !== 1) break;
          if(eleToActivate && ele.classList.contains('item')) {
            eleToActivate = ele;
            break;
          }
          if( ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click') ) {
            eleToActivate = ele;
          }
          if( ele.classList.contains('button') ) {
            eleToActivate = ele;
            break;
          }
          ele = ele.parentElement;
        }

        if(eleToActivate) {
          // queue that this element should be set to active
          queueElements[keyId] = eleToActivate;

          // in XX milliseconds, set the queued elements to active
          if(e.type === 'touchstart') {
            self._activateTimeout = setTimeout(activateElements, 80);
          } else {
            ionic.requestAnimationFrame(activateElements);
          }

          keyId = (keyId > 19 ? 0 : keyId + 1);
        }

      });
    },

    end: function() {
      // clear out any active/queued elements after XX milliseconds
      clearTimeout(this._activateTimeout)
      setTimeout(clear, 200);
    }

  };

  function clear() {
    // clear out any elements that are queued to be set to active
    queueElements = {};

    // in the next frame, remove the active class from all active elements
    ionic.requestAnimationFrame(deactivateElements);
  }

  function activateElements() {
    // console.log('ACTIVATING');
    // activate all elements in the queue
    for(var key in queueElements) {
      if(queueElements[key]) {
        queueElements[key].classList.add(ACTIVATED_CLASS);
        activeElements[key] = queueElements[key];
      }
    }
    queueElements = {};
  }

  function deactivateElements() {
    for(var key in activeElements) {
      if(activeElements[key]) {
        activeElements[key].classList.remove(ACTIVATED_CLASS);
        delete activeElements[key];
      }
    }
  }

})(document, ionic);
