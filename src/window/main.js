function createPlayerElement(id) {
  // Build the standard video element
  const playerElement = document.createElement('video')
  const poster = 'http://www.dr.dk/mu-online/api/1.3/bar/52d3f5e66187a2077cbac70e?width=322&height=181'

  playerElement.setAttribute('height', '480')
  playerElement.setAttribute('width', '640')
  playerElement.setAttribute('id', id)
  playerElement.setAttribute('class', 'video-js vjs-default-skin vjs-big-play-centered poc-player')
  playerElement.setAttribute('controls', '')
  playerElement.setAttribute('poster', poster)

  return playerElement
}

function createSourceElement(src) {
  const source = document.createElement('source')
  source.setAttribute('src', src)
  source.setAttribute('type', 'application/x-mpegURL')

  return source
}

function createPlayer(id) {
  // Initialize videojs on video-element id
  const player = videojs(id, {
    nativeControlsForTouch: false
  });

  // var vjsButton = videojs.getComponent('button');
  const Button = videojs.getComponent('Button');

  // Subclass the component (see 'extend' doc for more info)
  // list of components to extend http://docs.videojs.com/docs/guides/components.html
  const hqBtn = videojs.extend(Button, {
    constructor: function () {
      Button.apply(this, arguments)
      this.isHQ = false;
      /* initialize your button */
      // Add component specific styling
      this.addClass('hq-btn')
      this.el().innerHTML= 'HQ'
    },
    handleClick: function () {
      /* do something on click */
      // console.log("enable hq", !this.isHQ);
      // if(this.isHQ) {
      //   this.removeClass("active");
      //   this.isHQ = false;
      //   player.src({type: 'application/x-mpegURL', src: DR2 });
      //   player.play();
      // }else{
      //   this.addClass("active");
      //   this.isHQ = true;
      //   player.src({type: 'application/x-mpegURL', src: mSeedPeer });
      //   player.play()
      // }

    }
  });

  // Register the new component with videojs
  Button.registerComponent('hqBtn', hqBtn);

  // Add the bingmenu component to the player
  player.getChild('controlBar').addChild('hqBtn');

  return player
}

function setupVideoJs(src) {
  const id = `videojs_player_${+new Date()}`
  const playerElement = createPlayerElement(id)
  const sourceElement = createSourceElement(src)

  const formElement = document.querySelector('.player-seed')
  const containerElement = document.querySelector('.player-container');

  // append source to player
  playerElement.appendChild(sourceElement);

  // append video element to html handle.
  containerElement.appendChild(playerElement);

  const player = createPlayer(id)

  formElement.setAttribute('style', 'display: none;')
  containerElement.setAttribute('style', '')
}
