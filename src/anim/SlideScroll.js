const getMousePos = e => ({ x: e.clientX, y: e.clientY });

class SlideScroll {

	parent = { };

	state = {

	};

	constructor(state, setters){
		this.parent = { ...setters, state };
	}

	offsetTrackPosition = (x) => {
		const track = this.parent.state.track;
		const trackPos = this.parent.state.drag.trackPos;
		trackPos.x += x;

		track.style.left = `${trackPos.x}px`;
	}

	snapTrackPosition = () => {
		const trackLen = this.parent.state.track.getBoundingClientRect().width;
		const slideLen = this.parent.state.container.getBoundingClientRect().width;
		const trackPos = this.parent.state.drag.trackPos;

		let index = -Math.round(trackPos.x / slideLen);

		if( this.parent.state.settings.infinite ){
			if( index >= this.parent.state.slides.length ) index = 0;
			else if( index < 0 ) index = this.parent.state.slides.length - 1;
		} else {
			if( index >= this.parent.state.slides.length ) index = this.parent.state.slides.length - 1;
			else if( index < 0 ) index = 0;
		}

		const snapPosition = -(index * slideLen);
		this.parent.state.drag.trackPos.x = snapPosition;

		this.parent.state.track.style.left = `${snapPosition}px`;

		this.parent.setActive(index);
	}

	setTrackPosition = (index) => {
		const slideLen = this.parent.state.container.getBoundingClientRect().width;

		const snapPosition = -(index * slideLen);
		this.parent.state.drag.trackPos.x = snapPosition;

		this.parent.state.track.style.left = `${snapPosition}px`;

		this.parent.setActive(index);
	}

	onResize = (e) => {
		this.setTrackPosition(this.parent.state.active)
	}

	onPrev = (e) => {
		let index = this.parent.state.active - 1;

		if( this.parent.state.settings.infinite ){
			if( index >= this.parent.state.slides.length ) index = 0;
			else if( index < 0 ) index = this.parent.state.slides.length - 1;
		} else {
			if( index >= this.parent.state.slides.length ) index = this.parent.state.slides.length - 1;
			else if( index < 0 ) index = 0;
		}

		this.setTrackPosition(index);
	}

	onNext = (e) => {
		let index = this.parent.state.active + 1;

		if( this.parent.state.settings.infinite ){
			if( index >= this.parent.state.slides.length ) index = 0;
			else if( index < 0 ) index = this.parent.state.slides.length - 1;
		} else {
			if( index >= this.parent.state.slides.length ) index = this.parent.state.slides.length - 1;
			else if( index < 0 ) index = 0;
		}

		this.setTrackPosition(index);
	}

	onGoto = (e, i) => {
		this.setTrackPosition(i);
	}

	onGrab = (e) => {

	}

	onDrag = (e) => {
		const drag = this.parent.state.drag;

		const prevPos = drag.lastPos;
		const currentPos = drag.currentPos;

		const offsetX = currentPos.x - prevPos.x;

		this.offsetTrackPosition(offsetX);
	}

	onDrop = (e) => {
		this.snapTrackPosition();
	}

}


export default SlideScroll
