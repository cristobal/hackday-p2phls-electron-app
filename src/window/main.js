const player = videojs('player', {
  nativeControlsForTouch: false
});

const Button = videojs.getComponent('Button');


// Subclass the component (see 'extend' doc for more info)
// list of components to extend http://docs.videojs.com/docs/guides/components.html
const hqBtn = videojs.extend(Button, {
  constructor: function() {
    Button.apply(this, arguments);
    /* initialize your button */
    // Add component specific styling
    this.addClass('hq-btn');
    this.el().innerHTML= 'HQ';
  },
  handleClick: function () {
    /* do something on click */
  }
});

// Register the new component with videojs
Button.registerComponent('hqBtn', hqBtn);

// Add the bingmenu component to the player
player.getChild('controlBar').addChild('hqBtn');
