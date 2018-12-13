
function whenDocumentLoaded(action) {

	if (document.readyState === "loading") {

		document.addEventListener("DOMContentLoaded", action);
	} else {
		
		action();
	}
}

whenDocumentLoaded(() => {

	loadTopArticlesView(initial_dates, initTopArticlesView);
});


function loadTopArticlesView(domain, callback) {

	// TODO Bring back 
	const articles_url = "https://fivelinks.io/dataviz/topArticles";
	// const articles_url = "http://0.0.0.0:5000/topArticles"; //TODO Remove

	if (domain == null)
		domain = initial_dates;

	//TODO Remove
	function createRandomDate(dom) {

		let d = [];
		if (dom[0] < initial_dates[0]) 
			d[0] = initial_dates[0];
		else
			d[0] = dom[0];
		if (dom[1] > initial_dates[1]) 
			d[1] = initial_dates[1]; 
		else
			d[1] = dom[1];

		return new Date(d[0].getTime() + 
				Math.random() * (d[1].getTime() - d[0].getTime()));
	}


	const monthFormat = d3.timeFormat("%m");
	const yearFormat = d3.timeFormat("%Y");

	const url = articles_url + "/" + yearFormat(domain[0])
							 + "/" + monthFormat(domain[0])
							 + "/" + yearFormat(domain[1])	
							 + "/" + monthFormat(domain[1]);

	loadJSON(url, function(data) {

		// TODO Remove
		data.forEach(d => d["peak_date"] = createRandomDate(domain));

		callback(domain, data);
	});
}

function initTopArticlesView(domain, data) {

	// Dimensions
	const width = 400;
	const height = 200;
	
	// Scatterplot creation
	scatterplot = new ScatterPlot("scatterplot", data, width, height, domain);
	scatterplot.updateTopArticlesPlot(domain, data);

	// Brush area creation
	const brushHeight = 20;
	const brush = d3.brushX()
	          .extent([[0, 0], [width, brushHeight]])
	          .on("end", brushed);

	brush_area = new BrushArea(height + 3, width, brushHeight, 
								domain, brush);

	// Creation of list of top articles
	article_list = new ArticleList("list-top-articles", data);

    function brushed() {

		// Only transition after input.
		if (!d3.event.sourceEvent) return;

		// Ignore empty selections.
		if (!d3.event.selection) return;

		const domain = brush_area.updateBrushArea(this);

		if (state === "TopArticles") 
			loadTopArticlesView(domain, updateTopArticlesView);
		else if (state === "SingleArticle")
			loadArticleProgress(null)
		
		// events.updateEvents(domain);  //TODO Remove if not needed.
	}
}

function updateTopArticlesView(domain, data) {

	scatterplot.updateTopArticlesPlot(domain, data)
	article_list.updateArticleList(data);
}
