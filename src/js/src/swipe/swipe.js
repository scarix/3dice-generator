class Swipe {
  constructor(options) {
    this.target = options.target ? document.querySelector(options.target) : document.body
    this.onSwipe = options?.onSwipe || noop
    this.direction = options?.direction || false

    this.xDown = null
    this.yDown = null

    this.init()
  }

  init() {
    this.target.addEventListener('touchstart', this.handleTouchStart.bind(this), false);

    if (this.direction) {
      this.target.addEventListener('touchmove', this.handleTouchMoveDirection.bind(this), false);
    } else {
      this.target.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    }
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

  handleTouchMoveDirection(evt) {

    if ( ! this.xDown || ! this.yDown || ! this.direction) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    let onSwipeAction = false;

    if (this.direction === 'up' && yDiff > 10) {
      onSwipeAction = true;
    } else if (this.direction === 'down' && yDiff < -10) {
      onSwipeAction = true;
    } else if (this.direction === 'left' && xDiff > 10) {
      onSwipeAction = true;
    } else if (this.direction === 'right' && xDiff < -10) {
      onSwipeAction = true;
    }

    if (onSwipeAction) {
      this.onSwipe()
    }

    /* reset values */
    this.xDown = null;
    this.yDown = null;
  }
}

export default Swipe