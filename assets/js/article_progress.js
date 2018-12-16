// Read data from REST API

function loadArticleProgress(article_name, callback) {

	if (article_name != null)
		loadArticleProgress.article_name = article_name;

	// TODO Normally should be removed...
	// // Set state to single article view
	// state = "SingleArticle";

	const daily_views_url = "https://wikimedia.org/api/rest_v1/metrics/pageviews/" + 
							"per-article/en.wikipedia.org/all-access/user/";

	const monthFormat = d3.timeFormat("%m");
	const yearFormat = d3.timeFormat("%Y");
	const dayFormat = d3.timeFormat("%d");

	// Get domain from brush
	let domain =  brush_area.getBrushSelection();

	// If no area is selected in the brush, aka we are in the initial top
	// articles view, we set the domain to the maximum range of dates for
	// which we have data.
	if (domain == null)
		domain = initial_dates;

	// If the selected domain is 2 months or smaller, we load the daily
	// page counts, otherwise, the monthly ones.
	let url;
	let granularity;
	// if ((monthFormat(domain[1]) - monthFormat(domain[0]) < 1) &&
	// 	(yearFormat(domain[1]) - yearFormat(domain[0]) < 1)) {

	// 	console.log("daily gran");
	// 	granularity = "/daily/";
	// } else {
		console.log("monthly gran");
		granularity = "/monthly/";

		console.log("domain: " + domain);
		console.log("new end: " + new Date(yearFormat(domain[1]), 
											monthFormat(domain[1] + 1)));
	// }

	url = daily_views_url + loadArticleProgress.article_name
								  	.replace(/\\/g, "")
								  	.replace(/[!'()*]/g, escape)					
				 	  		  + granularity
					 		  + yearFormat(domain[0])
					 		  + monthFormat(domain[0])
					 		  + dayFormat(domain[0]) + "/"
					 		  + yearFormat(domain[1])
					 		  + monthFormat(domain[1])
					 		  + dayFormat(domain[1]);
	
  	console.log("url: " + url);

	loadJSON(url, function(data) {

		console.log(data);

		// Set state to single article view
		state = "SingleArticle";

		// Do transition actions, only if a new article name is
		// given, 
		if (article_name != null) {
			console.log("Bika edw");
			initSingleArticleView(article_name);
		}
		
		updateSingleArticleView(domain, data);
	}, callback);
}

function initSingleArticleView(article_name, callback) {

	function clearPlot() {

		// Delete all circles to prepare for single article view
		const circles = d3.selectAll("circle");
		circles.classed("deleted", true);

		circles.transition()
			   .duration(200)
			   .style("opacity", "0")
			   .remove();

	   	// Remove all trailing tooltips
	   	d3.selectAll(".tooltip")
   		  .transition()		
		  .duration(500)
		  .style("opacity", 0)
		  .remove();

	  	// Delete path, if it exists
	  	d3.selectAll(".line")
	  		.transition()
	  		.duration(200)
	  		.style("opacity", 0)
	  		.remove();
	}

	function returnToTopArticles() {

		state = "TopArticles";

		// Show list of top articles
		d3.select("#list-top-articles")
		  .transition()
		  .duration(500)
		  .style("height", "425px");

	    // Hide article summary
	  	d3.select("#article-summary")
  			.html("");

	  	this.remove();

	  	// Clear everything from plot
	  	clearPlot();

	  	const domain = brush_area.getBrushSelection();
	  	loadTopArticlesView(domain, updateTopArticlesView);
	}

	function showArticleSummary(article_name) {

		// Hide list of top articles
		d3.select("#list-top-articles")
		  .transition()
		  .duration(500)
		  .style("height", "0px");

		// TODO Check if this works as it should!! 
	  	// Hide article summary
	  	d3.select("#article-summary")
  			.html("");

		// Append close button
		const close_button = d3.select("#article-summary")
							  	.append("div")
							  	.style("word_wrap", "normal")
							  	.style("width", "100%")
							  	.append("button")
						          	.attr("type", "button")
						          	.classed("btn", true)
						          	.classed("btn-light", true)
						          	.on("click", returnToTopArticles)
					          	.append("i")
					          		.classed("fas fa-chevron-left", true);

  		close_button.text(" Back to top articles");

    	// Show article summary
    	const sum = d3.select("#article-summary")
    	sum.append("br");
		sum.append("div")
			.style("font-size", "18px")
			.append("u")
			.text(cleanArticleName(article_name));
		
		sum.append("div")
			//TODO Bring back
			// .text(d.article_summary);
			// TODO Remove
			.text("Lorem ipsum dolor sit amet, consectetur adipiscing" +
				  " elit, sed do eiusmod tempor incididunt ut labore" + 
				  " et dolore magna aliqua. Ut enim ad minim veniam," + 
				  " quis nostrud exercitation ullamco laboris nisi ut" + 
				  " aliquip ex ea commodo consequat. Duis aute irure" + 
				  " dolor in reprehenderit in voluptate velit esse " +
				  "cillum dolore eu fugiat nulla pariatur. ")
			.append("a")
			.attr("target", "_blank")
			.attr("href", "https://en.wikipedia.org/wiki/" + 
							article_name)
			.text("(View more)");
	}

	// Show article summary
	showArticleSummary(article_name);
	// Clear everything from plot
	clearPlot();
	// Show single article view
    // loadArticleProgress(article_name, callback);
}


function updateSingleArticleView(domain, data) {

	function parseDate(str) {

		return new Date(str.substring(0, 4), 
						str.substring(4, 6) - 1, 
						str.substring(6, 8));
	}

	// Preprocess JSON
	data = data["items"];
	data.forEach(function(d) {

		// Each article's id is its name and timestamp
		d.article_id = convertToID(d.article) + "_" + d.timestamp;

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
