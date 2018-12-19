// Initialize global variables

// Initial date  //TODO Change appropriately
// WATCH OUT! Month is an index, beginning from 0 !!
// const initial_dates = [new Date(2014, 0, 1), new Date(2018, 11, 31)];
const initial_dates = [new Date(2017, 0, 1), new Date(2018, 10, 30)];

// Viz elements
let scatterplot;   	//Stores instance of scatterplot class
let brush_area;   	//Stores instance of brush class
let brush;       	//Stores brush element
let article_list;   //Stores instance of article list class
let events;			//Stores instance of event class

// Global vars
const circle_radius = 2.5;   	//Radius of circle on top articles view

let selected_events_list = []; 	//List of events that have been selected on 
								// the left side panel

// State
let state = "TopArticles";	// Global state of the viz (either "TopArticles" 
							// or "SingleArticle").

let ignore_event = false;	// Prevents brush event propagation, when
							// the brush selection is rounded, for 
							// better visualization. 
