// Read data from REST API

function showArticleProgress(article_name) {

	const daily_views_url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/" + 
							"per-article/en.wikipedia.org/all-access/user/";

	const monthFormat = d3.timeFormat("%m");
	const yearFormat = d3.timeFormat("%Y");

	// TODO Change initial date?
	loadJSON(daily_views_url + article_name
								.replace(/\\/g, "")
								.replace(/[!'()*]/g, escape)					
							 + "/monthly/"
							 + "20170101/20180101",  //TODO Remove

							 // TODO Bring back
							 // + yearFormat(initial_dates[0])
							 // + monthFormat(initial_dates[0])
							 // + "01/"
							 // + yearFormat(initial_dates[1])
							 // + monthFormat(initial_dates[1])
							 // + "01", 
	function(data) {

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
		scatterplot.updateSingleArticlePlot(null, data);
	})
}
