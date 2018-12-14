// Read data from REST API

function loadArticleProgress(article_name) {

	if (article_name != null)
		loadArticleProgress.article_name = article_name;

	// Set state to single article view
	state = "SingleArticle";

	const daily_views_url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/" + 
							"per-article/en.wikipedia.org/all-access/user/";

	const monthFormat = d3.timeFormat("%m");
	const yearFormat = d3.timeFormat("%Y");

	// Get domain from brush
	let domain =  brush_area.getBrushSelection();

	// If no area is selected in the brush, aka we are in the initial top
	// articles view, we set the domain to the maximum range of dates for
	// which we have data.
	if (domain == null)
		domain = initial_dates;

	const url = daily_views_url + loadArticleProgress.article_name
									  .replace(/\\/g, "")
									  .replace(/[!'()*]/g, escape)					
					 	  		+ "/monthly/"
						 		+ yearFormat(domain[0])
						 		+ monthFormat(domain[0])
						 		+ "01/"
						 		+ yearFormat(domain[1])
						 		+ monthFormat(domain[1])
						 		+ "01";

	loadJSON(url, function(data) {

		updateSingleArticleView(domain, data);
	})
}

function updateSingleArticleView(domain, data) {

	function parseDate(str) {

		return new Date(str.substring(0, 4), 
						str.substring(4, 6), 
						str.substring(6, 8));
	}

	// Preprocess JSON
	data = data["items"];
	data.forEach(function(d) {

		d.article_id = d.timestamp;

	 	d.article_name = d.article;
	 	delete d.article;

	 	d.view_count = d.views;
	 	delete d.views;

	 	d.peak_date = parseDate(d.timestamp);
	 	delete d.timestamp;
	});

	// Update scatterplot
	scatterplot.updateSingleArticlePlot(domain, data);
}
