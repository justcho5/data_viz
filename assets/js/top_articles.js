// Read data from REST API
 
const articles_url = "https://fivelinks.io/dataviz/topArticles";

function whenDocumentLoaded(action) {

	if (document.readyState === "loading") {

		document.addEventListener("DOMContentLoaded", action);
	} else {
		
		action();
	}
}

whenDocumentLoaded(() => {

	// Initial date
	const url = articles_url + "/2014/10/2015/03";
	loadJSON(url, showTopArticles);
});

let scatterplot;
let brush_area;
let article_list;

function showTopArticles(data) {

	// TODO Remove
	data.forEach(d => d["peak_date"] = createRandomDate());

	// Dimensions
	const width = 400;
	const height = 200;
	
	// Scatterplot creation
	scatterplot = new ScatterPlot("scatterplot", data, width, height);
	
	// Brush area creation
	let brushHeight = 20;
	let brush = d3.brushX()
			        .extent([[0, 0], [width, brushHeight]])
			        .on("end", brushed);

	brush_area = new BrushArea(height + 3, width, brushHeight, brush);

	// Creation of list of top articles
	article_list = new ArticleList("list-top-articles", data);

    function brushed() {

		// Only transition after input.
		if (!d3.event.sourceEvent) return;

		// Ignore empty selections.
		if (!d3.event.selection) return;

		const domain = brush_area.updateBrushArea(this);

		let monthFormat = d3.timeFormat("%m");
		let yearFormat = d3.timeFormat("%Y");

		const url = articles_url
					+ "/" + yearFormat(domain[0])
					+ "/" + monthFormat(domain[0])
				 	+ "/" + yearFormat(domain[1])
				 	+ "/" + monthFormat(domain[1]);

		loadJSON(url, function(data) {

			// TODO Remove
			data.forEach(d => d["peak_date"] = createRandomDate(domain));

			scatterplot.updateCircles(domain, data)
			article_list.updateArticleList(data);
		});
		
		// events.updateEvents(domain);  //TODO Remove if not needed.
	}
}

//TODO Remove
function createRandomDate(dom) {

	let domain = [new Date(2014, 9, 1), new Date(2015, 2, 31)];
	if (dom !== undefined) {

		if (dom[0] > domain[0]) domain[0] = dom[0];
		if (dom[1] < domain[1]) domain[1] = dom[1]; 
	}

	return new Date(domain[0].getTime() + 
			Math.random() * (domain[1].getTime() - domain[0].getTime()));
}
