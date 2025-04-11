class Swipe {
  constructor(options) {
    this.target = options.target ? document.querySelector(options.target) : document.body
    this.onSwipe = options?.onSwipe || noop

    this.xDown = null
    this.yDown = null

    this.init()
  }

  init() {
    this.target.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    this.target.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
  }

  handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  }

  handleTouchMove(evt) {
    if ( ! this.xDown || ! this.yDown ) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    if ( Math.abs( xDiff ) >= 10 || Math.abs( yDiff ) >= 10 ) {
      if (this.onSwipe) {
        this.onSwipe()
      }
    }

    /* reset values */
    this.xDown = null;
    this.yDown = null;
  }
}

export default Swipe