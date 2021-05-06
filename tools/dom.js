'use strict';

import Core from './core.js';

/**
 * Dom module
 * @module tools/dom
 */
export default class Dom {
	
	/**
	* Retrieve an element using a selector
	* @param {element} pNode - The parent node where to begin the search
	* @param {string} selector - A selector statement
	* @returns {element} The element found, null otherwise
	*/
	static Node(pNode, selector) {
		return pNode.querySelectorAll(selector).item(0) || null;
	}
	
	/**
	* Retrieve multiple elements using a selector
	* @param {element} pNode - The parent node where to begin the search
	* @param {string} selector - A selector statement
	* @returns {elements} The elements found, null otherwise
	*/
	static Nodes(pNode, selector) {
		return pNode.querySelectorAll(selector) || null;
	}

	/**
	* Create an element
	* @param {string} tagName - The type of element to be created (div, span, label, input, etc.)
	* @param {object} options - A dictionary type object containing the options to assign to the created Element
	* @param {element} pNode - The parent element where the created element will be apended
	* @returns {element} The element created
	*/
	static Create(tagName, options, pNode) {
		var elem = document.createElement(tagName);
		
		Core.Mixin(elem, options);
		
		this.Place(elem, pNode);
		
		return elem
	}

	/**
	* Create an SVG Element
	* @param {string} tagName - The type of SVG element to be created (rect, path, etc.)
	* @param {object} options - Dictionary type object containing the options to assign to the created SVG Element
	* @param {element} pNode - The parent element where the created SVG element will be apended
	* @returns {element} The SVG element created
	*/
	static CreateSVG(tagName, options, pNode) {
		var elem = document.createElementNS("http://www.w3.org/2000/svg", tagName);
		
		for (var id in options) elem.setAttribute(id, options[id]);
		
		this.Place(elem, pNode);
		
		return elem;
	}

	/**
	* Create an element from a namespace
	* @param {string} ns - The URI namespace containing the element to create 
	* @param {string} tagName - The type of element to be created (rect, path, etc.)
	* @param {object} options - A dictionary type object containing the options to assign to the created Element
	* @param {element} pNode - The parent element where the created element will be apended
	* @example
	* Valid Namespaces are : 
	*	HTML : http://www.w3.org/1999/xhtml
	*	SVG  : http://www.w3.org/2000/svg
	*	XBL  : http://www.mozilla.org/xbl
	*	XUL  : http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul
	* @returns {element} The SVG Element created
	*/
	static CreateNS(ns, tagName, options, pNode) {
		var elem = document.createElementNS(ns, tagName);
		
		for (var id in options) elem.setAttribute(id, options[id]);
		
		this.Place(elem, pNode);
		
		return elem;
	}

	/**
	* Append an element to another element
	* @param {element} elem - The element to be appended
	* @param {element} pNode - The parent element where the element will be appended
	* @returns {void}
	*/
	static Place(elem, pNode) {
		if (!!pNode) pNode.appendChild(elem);
	}

	/**
	* Replace an element with another element
	* @param {element} elem1 - The element to be replaced
	* @param {element} elem2 - The element that will replace elem1
	* @returns {void}
	*/
	static Replace(elem1, elem2) {
		var pNode = elem1.parentNode;
		
		pNode.insertBefore(elem2, elem1);

		this.Remove(elem1, pNode);
	}

	/**
	* Remove an element from another element
	* @param {element} elem - The element to remove
	* @param {element} pNode - The parent element containing the element to remove
	* @returns {void}
	*/
	static Remove(elem, pNode) {
		if (!pNode.children.some(function(child) { return (child === elem); })) return;
		
		pNode.removeChild(elem);
	}

	/**
	* Remove all children of an element
	* @param {element} elem - The element to empty
	* @returns {void}
	*/
	static Empty(elem) {
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	}

	/**
	* Add a CSS rule to an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to add to the element
	* @returns {void}
	*/
	static AddCss(elem, css) {
		var c1 = elem.className.split(" ");
		
		css.split(" ").forEach(function(c) {
			if (c1.indexOf(c) == -1) c1.push(c);
		})
		
		elem.className = c1.join(" "); 
	}

	/**
	* Remove a CSS rule from an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to remove from the element
	* @returns {void}
	*/
	static RemoveCss(elem, css) {				
		var c1 = elem.className.split(" ");
		var c2 = css.split(" ");
		
		elem.className = c1.filter(function(c) { return c2.indexOf(c) == -1; }).join(" ");
	}

	/**
	* Verify that an element contains a CSS rule
	* @param {element} elem - The element to verify
	* @param {string} css - The CSS rule to find
	* @returns {boolean} True if the element contains the CSS rule, false otherwise
	*/
	static HasCss(elem, css) {
		return (' ' + elem.className + ' ').indexOf(' ' + css + ' ') > -1;
	}

	/**
	* Set the CSS rules on an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to set on the element
	* @returns {void}
	*/
	static SetCss(elem, css) {
		elem.className = css; 
	}

	/**
	* Toggle a CSS rule on or or off for an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to toggle on the element
	* @param {boolean} enabled - True to toggle the CSS rule on, false to toggle it off
	* @returns {void}
	*/
	static ToggleCss(elem, css, enabled) {
		if (enabled) this.AddCss(elem, css);
		
		else this.RemoveCss(elem, css);
	}
	
	/**
	* Get an attribute value from an element
	* @param {element} elem - The element to retrieve the attribute from
	* @param {string} attr - The name of the attribute to retrieve
	* @returns {string} The value of the attribute if found, null otherwise
	*/
	static GetAttribute(elem, attr) {
		var attr = elem.attributes.getNamedItem(attr);
		
		return attr ? attr.value : null;
	}
	
	/**
	* Set an attribute value on an element
	* @param {element} elem - The element to set the attribute on
	* @param {string} attr - The name of the attribute to set
	* @param {string} value - The value of the attribute to set
	* @returns {void}
	*/
	static SetAttribute(elem, attr, value) {
		elem.setAttribute(attr, value);
	}
	
	/**
	* Get the size of an element
	* @param {element} elem - The element to retrieve the size
	* @returns {object} An object literal containing the unpadded size of the element
	* @example
	* { 
	*	w: width of the element, 
	*	h: height of the element 
	* }
	*/
	static Size(elem) {
		var style = window.getComputedStyle(elem);
		
		var h = +(style.getPropertyValue("height").slice(0, -2));
		var w = +(style.getPropertyValue("width").slice(0, -2));
		var pL = +(style.getPropertyValue("padding-left").slice(0, -2));
		var pR = +(style.getPropertyValue("padding-right").slice(0, -2));
		var pT = +(style.getPropertyValue("padding-top").slice(0, -2));
		var pB = +(style.getPropertyValue("padding-bottom").slice(0, -2));
		
		var w = w - pL - pR;
		var h = h - pT - pB;
		
		// Use smallest width as width and height for square grid that fits in container
		// var s = w < h ? w : h;
		
		return { w : w , h : h }
	}
	
	/**
	* Get the siblings of an element
	* @param {element} elem - The element to retrieve the siblings
	* @returns {elements} An array of elements containing the siblings of the input element
	*/
	static Siblings(elem) {
		var elements = [];
		
		for (var i = 0; i < elem.parentNode.children.length; i++) elements.push(elem.parentNode.children[i]);
		
		elements.splice(elements.indexOf(elem), 1);
		
		return elements;
	}
	
	
	/**
	* Returns the geometry of a dom node (width, height)
	* @param {element} elem - The element from which to retrieve the geometry
	* @returns {object} An object containing the unpadded width and height of the element
	*/
	static Geometry(elem) {
		var style = window.getComputedStyle(elem);
		
		var h = +(style.getPropertyValue("height").slice(0, -2));
		var w = +(style.getPropertyValue("width").slice(0, -2));
		var pL = +(style.getPropertyValue("padding-left").slice(0, -2));
		var pR = +(style.getPropertyValue("padding-right").slice(0, -2));
		var pT = +(style.getPropertyValue("padding-top").slice(0, -2));
		var pB = +(style.getPropertyValue("padding-bottom").slice(0, -2));
		
		var w = w - pL - pR;
		var h = h - pT - pB;
		
		// Use smallest width as width and height for square grid that fits in container
		// var s = w < h ? w : h;
		
		return { w : w , h : h }
	}
}