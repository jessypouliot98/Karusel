import SlideScroll from './anim/SlideScroll';
import './karusel.scss';

const getMousePos = e => {
	let cursor = e;

	if( e instanceof TouchEvent ){
		cursor = e.touches[0];
	}

	return { x: cursor.clientX, y: cursor.clientY };
};

const changeClass = (fn, target, className) => {
	if( Array.isArray(target) ) target.forEach(el => el.classList[fn](className));
	else target.classList[fn](className);
}

const addClass = (target, className) => changeClass('add', target, className);
const remClass = (target, className) => changeClass('remove', target, className);

const addContainer = (element, tag = 'div') => {
	const insertElementInContainer = (el) => {
		const node = document.createElement(tag);
		node.appendChild(el);
		return node;
	}

	if( Array.isArray(element) )
		return element.map(insertElementInContainer);
	else
		return insertElementInContainer(element);
}

const getElement = (element) => {
	return new Promise((resolve, reject) => {
		const tempHTML = document.createElement('div');

		if( typeof element === 'string' ){
			tempHTML.innerHTML = element;
			resolve(tempHTML.firstChild);

		} else if( element instanceof HTMLElement ){
			resolve(element);

		} else {
			reject('invalid element');

		}

	});
}

class Karusel {

	LISTENERS = [];

	state = {
		container: undefined,
		track: undefined,
		slides: [],

		active: 0,

		ui: {
			container: undefined,
			content: undefined,
			dots: {
				container: undefined,
				items: [],
			},
			arrows: {
				prev: undefined,
				next: undefined
			}
		},

		drag: {
			isDragging: false,
			current: { x: 0, y: 0 },
			lastPos: { x: 0, y: 0 },
			trackPos: { x: 0, y: 0 },
		},

		delegate: undefined,

		settings: {
			slidesToShow: 1,
			speed: 300,
			autoplaySpeed: 1500,
			infinite: true,
			prevArrow: '<button><</button>',
			nextArrow: '<button>></button>',
			delegate: SlideScroll,
		}
	}

	constructor(container, settings){
		this.state.container = container;
		this.state.settings = { ...this.state.settings, ...settings };

		this.init();
	}

	init = async() => {
		await this.setHTML();
		this.setClassNames();
		this.setSizes();

		this.setDelegate();

		this.initListeners();
	}

	setHTML = async() => {
		const slides = addContainer( Array.from(this.state.container.children) );
		this.state.slides = slides;

		this.state.track = document.createElement('div');
		this.state.container.appendChild( this.state.track );
		this.state.slides.forEach( child => this.state.track.appendChild(child) );

		this.state.ui.container = document.createElement('div');
		this.state.ui.content = document.createElement('div');
		this.state.ui.dots.container = document.createElement('div');
		this.state.slides.forEach( (child, i) => this.state.ui.dots.items.push(document.createElement('div')) );
		this.state.ui.arrows.prev = await getElement(this.state.settings.prevArrow);
		this.state.ui.arrows.next = await getElement(this.state.settings.nextArrow);

		this.state.container.appendChild( this.state.ui.container );
		this.state.ui.container.appendChild( this.state.ui.content );
		this.state.ui.content.appendChild( this.state.ui.dots.container );
		this.state.ui.dots.items.forEach( item => this.state.ui.dots.container.appendChild(item) );
		this.state.ui.content.appendChild(this.state.ui.arrows.prev);
		this.state.ui.content.appendChild(this.state.ui.arrows.next);
	}

	setClassNames = () => {
		//KARUSEL
		addClass(this.state.container, 'karu-container');
		addClass(this.state.track, 'karu-track');
		addClass(this.state.slides, 'karu-slide');

		//UI
		addClass(this.state.ui.container, 'karu-ui');
		addClass(this.state.ui.content, 'karu-ui__content');
		addClass(this.state.ui.dots.container, 'karu-ui__dots');
		addClass(this.state.ui.dots.items, 'karu-dots__item');
		addClass(this.state.ui.arrows.prev, 'karu-ui__arrow');
		addClass(this.state.ui.arrows.prev, 'karu-ui__arrow--prev');
		addClass(this.state.ui.arrows.next, 'karu-ui__arrow');
		addClass(this.state.ui.arrows.next, 'karu-ui__arrow--next');

		this.setActiveClassNames();
	}

	setActiveClassNames = () => {
		const index = this.state.active;

		//arrow active class
		if( !this.state.settings.infinite ){
			if( index <= 0 ){
				addClass(this.state.ui.arrows.prev, 'karu-ui__arrow--end');
				remClass(this.state.ui.arrows.next, 'karu-ui__arrow--end');
			} else if( index >= this.state.slides.length - 1 ) {
				addClass(this.state.ui.arrows.next, 'karu-ui__arrow--end');
				remClass(this.state.ui.arrows.prev, 'karu-ui__arrow--end');
			} else {
				remClass(this.state.ui.arrows.prev, 'karu-ui__arrow--end');
				remClass(this.state.ui.arrows.next, 'karu-ui__arrow--end');
			}
		}

		//dots active class
		const prevActiveDot = this.state.ui.dots.container.querySelector('.karu-dots__item--active');
		const currentActiveDot = this.state.ui.dots.items[index];

		if( prevActiveDot )
			remClass(prevActiveDot, 'karu-dots__item--active');

		addClass(currentActiveDot, 'karu-dots__item--active');
	}

	setSizes = () => {
		const { width, height } = this.state.container.getBoundingClientRect();

		this.state.slides.forEach(slide => {
			slide.style.width = `${width}px`;
		});

		this.state.track.style.width = `${width * this.state.slides.length}px`;
	}

	setActive = (index) => {
		this.state.active = index;
		this.setActiveClassNames();
	}

	setDelegate = () => {
		this.state.delegate = new this.state.settings.delegate(this.state, {
			setActive: this.setActive
		});
	}

	setEventListener = (node, type, callback) => {
		node.addEventListener(type, callback);
		this.LISTENERS.push({ node, type, callback });
	}

	initListeners = () => {
		//window
		this.setEventListener(window, 'resize', this.onResize);

		//swipe events
		this.setEventListener(this.state.container, 'mousedown', this.onGrab);
		this.setEventListener(this.state.container, 'touchstart', this.onGrab);

		this.setEventListener(document, 'mousemove', this.onDrag);
		this.setEventListener(document, 'touchmove', this.onDrag);

		this.setEventListener(document, 'mouseup', this.onDrop);
		this.setEventListener(document, 'touchend', this.onDrop);

		//ui events
		this.setEventListener(this.state.ui.arrows.prev, 'click', this.onPrev);
		this.setEventListener(this.state.ui.arrows.next, 'click', this.onNext);
		this.state.ui.dots.items.forEach((dot, i) => {
			this.setEventListener(dot, 'click', (e) => this.onGoto(e, i));
		})
	}

	onResize = (e) => {
		this.setSizes();

		this.state.delegate.onResize(e);
	}

	onPrev = (e) => {
		e.preventDefault();
		this.state.delegate.onPrev(e);
	}

	onNext = (e) => {
		e.preventDefault();
		this.state.delegate.onNext(e);
	}

	onGoto = (e, i) => {
		e.preventDefault();
		this.state.delegate.onGoto(e, i);
	}

	onGrab = (e) => {
		this.state.drag.isDragging = true;

		this.state.track.style.transitionDuration = '0ms';
		this.state.track.style.cursor = 'grabbing';

		const mousePos = getMousePos(e);
		this.state.drag.lastPos = mousePos;
		this.state.drag.currentPos = mousePos;

		this.state.delegate.onGrab(e);
	}

	onDrag = (e) => {
		if(!this.state.drag.isDragging) return;

		const drag = this.state.drag;

		drag.lastPos = drag.currentPos;
		drag.currentPos = getMousePos(e);

		this.state.delegate.onDrag(e);

		drag.lastPos = drag.currentPos;
	}

	onDrop = (e) => {
		if(!this.state.drag.isDragging) return;
		this.state.drag.isDragging = false;

		this.state.track.style.transitionDuration = `${this.state.settings.speed}ms`;
		this.state.track.style.cursor = 'grab';

		this.state.delegate.onDrop(e);
	}

}

export default Karusel
