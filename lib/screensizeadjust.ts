import { Gdk } from "imports"

/*
* 		value must between 0 and 1
* @param {number} value
*/


export const winheight = (value) => {
	const screenHeight = Gdk.Screen.get_default().get_height(); 
	const winheight = (screenHeight * value );
	return winheight;
}

export const winwidth = (value) => {
	const screenWidth = Gdk.Screen.get_default().get_width(); 
	const winwidth = (screenWidth * value ); 
	return winwidth;
}
