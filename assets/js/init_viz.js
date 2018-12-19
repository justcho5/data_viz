// Initialize global variables

// Initial date  //TODO Change appropriately
// WATCH OUT! Month is an index, beginning from 0 !!
// const initial_dates = [new Date(2014, 0, 1), new Date(2018, 11, 31)];
const initial_dates = [new Date(2017, 0, 1), new Date(2018, 10, 30)];

// Viz elements
let scatterplot;
let brush_area;
let brush;
let article_list;
let events;

// Global vars
const circle_radius = 2.5;
let selected_events_list = [];

// State
// Possible values: ["TopArticles", "SingleArticle"]
let state = "TopArticles";
let ignore_event = false;
