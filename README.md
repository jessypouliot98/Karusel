# Features

Karusel is the next generation lightweight dependancy free Carousel for all for all of your needs. Did I also mention it's super customizable ? [Learn more here][customize]

# Installation

```shell
	npm i -s karusel
```

# Usage

Karusel params:
1.	container
	-	*Node element*
2.	settings
	-	*Object - optional*

```js
// import Karusel into your project
import Karusel from 'karusel'
or
const Karusel = require('karusel');

...

// Instanciate a new Karusel instance
const container = document.getElementById('container');
const settings = { ... };

const slider = new Karusel( container, settings );
```

Example HTML from the exemple above

```html
<div id="container">

	<img src="/path/to/your/image-1.jpeg"/>

	<img src="/path/to/your/image-2.jpeg"/>

	<img src="/path/to/your/image-3.jpeg"/>

</div>
```

# Customize

Karusel is the perfect slider for every needs, all you need to do is customize it's style or behavior.

To customize it's style, you can change the arrows into the settings parameter

exemple:
```js
new Karusel( container, {
	prevArrow: '<button><img src="/path/to/some/img-prev.png"/></button>',
	nextArrow: document.createElement('button')
} );
```
You need support for JSX and React ? Go [download react-karusel](https://www.npmjs.com/package/react-karusel "download react-karusel") instead !
[h1-customize]: #h1-customize "Learn more here"

To change the behavior of the slider, you need to pass in a new delegate.

To create a new custom delegate you will need to create a new Class as shown below
```js
const getMousePos = e => ({ x: e.clientX, y: e.clientY });

class MyDelegate {

	constructor(state, setters){
		this.state = {};
		this.parent = { ...setters, state };
	}

	onResize = (e) => { /* Called when window gets resized */ }

	onPrev = (e) => { /* Called when prevArrow is clicked */ }

	onNext = (e) => { /* Called when nextArrow is clicked */ }

	onGoto = (e, i) => { /* Called when a dot is clicked */ }

	onGrab = (e) => { /* Called when mouse is pressed on Karusel container */ }

	onDrag = (e) => { /* Called when mouse move or touch move and mouse/touch is pressed */ }

	onDrop = (e) => { /* Called when mouse released or touch end */ }

}

export default MyDelegate
```
With this custom delegate class, you can insert it into the Karusel's settings to change it's behavior to whatever you want !
