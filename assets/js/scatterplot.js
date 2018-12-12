
class ScatterPlot {

	constructor(svg_element_id, data, width, height) {
		
		// Ranges & Scales
		const xRange = [new Date(2012, 11, 1), new Date(2019, 1, 1)];
		const yRange = [0, (d3.max(data, d => d.view_count)) + 100000];

		this.xScale = d3.scaleTime()
							.domain(xRange)
							.range([0, width - 1]);

		this.yScale = d3.scaleLinear()
							.domain(yRange)
							.range([height - 10, -10]);

		// Color gradient for datapoints based on y scale
		// const grad_scale = this.yScale.domain()[1]
		// const colors = ["#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15"] 
		// this.color_gradient = d3.scaleLinear()
		// 				.domain(d3.ticks(0, grad_scale, 5))
		// 				.range(colors);

		//Create scatterplot and surrounding g elements
		const svg = d3.select("#" + svg_element_id);

		this.focus_area = svg.append("g")
							 .classed("focus", true);

		this.focus_area.append('rect')
					.attr("x", "0")
					.attr("y", "-10")
					.attr("width", width)
					.attr("height", height)
					.attr("id", "canvas");

		// Create and append X axis
		let xAxisHeight = height - 10;
		this.xAxis = d3.axisBottom(this.xScale)
						.tickSize(2)
						.ticks(6);

		this.focus_area.append("g")
					   .classed("axis axis-x", true)
					   .attr("transform", "translate(0," + xAxisHeight + ")")
	      			   .call(this.xAxis);

		// Create Y axis	
		this.yAxis = d3.axisLeft(this.yScale)
						.tickSize(2)
						.tickFormat(function (d) {
					        
					        const prefix = d3.format("~s");
					        return prefix(d);
					    })
					    .tickPadding(6);

		//JUSTINA	

		// Color gradient for datapoints based on y scale
		const grad_scale = [yRange[0], (yRange[0] + yRange[1])/2, yRange[1]]
		const colors = ["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"];
		this.color_gradient = d3.scaleLinear()
								.domain(grad_scale)
								.range([colors[4], colors[2], colors[0]]);


		let legend_data = d3.range(yRange)
		let defs = this.focus_area.append('defs');
		let linearGradient = defs.append('linearGradient')
							 	 .attr('id', 'linear-gradient');

		linearGradient.attr("x1", "0%")
					  .attr("y1", "0%")
					  .attr("x2", "0%")
					  .attr("y2", "100%");

		linearGradient.selectAll("stop")
					  .data([	{offset: "0%", color: colors[0]},
						 		{offset: "50%", color: colors[2]},
						 		{offset: "100%", color: colors[4]},
					        ])
					  .enter()
					  .append("stop")
					  		.attr("offset", d => d.offset)
						  	.attr("stop-color", d => d.color);

      	 this.focus_area.append("rect")
      	 				.attr("x", -14)
      	 				.attr("y", -10)
      	 				.attr("width", 14)
      	 				.attr("height", height)
      	 				.style("fill", "url(#linear-gradient)");

		// Append Y axis
		this.focus_area.append("g")
						.classed("axis axis-y", true)
			      		.call(this.yAxis);

		// Create article circles
		let circles = this.focus_area
							.selectAll("circle")
							// Bind each svg circle to a unique data element
							.data(data, d => d.article_id);

		circles.enter()	
				.append("circle")
					.attr("id", d => "article_" + d.article_id)
					.attr("r", 2.5)
					.attr("cx", d => this.xScale(d.peak_date))
					.attr("cy", d => this.yScale(d.view_count))
					.attr("fill", d => this.color_gradient(d.view_count))
					// Tooltip behaviour. 
					.on("mouseover", this.onMouseOver)					
			        .on("mouseout", this.onMouseOut)
					// Selected article behaviour
			        .on("click", this.onClick);

		//JUSTINA

	}

	updateCircles(dom, data) {

		// Expand plot domain by 2 days, so that circles
		// won't fall on the plot's borders
		let domain = [];
		
		domain[0] = new Date(dom[0]);
		domain[0].setDate(domain[0].getDate() - 1);
		
		domain[1] = new Date(dom[1]);
		domain[1].setDate(domain[1].getDate() + 1);

		// Update xScale domain
		this.xScale.domain(domain);

		// Update circles
		let circles = this.focus_area.selectAll("circle")
										// Bind each svg circle to a 
										// unique data element
										.data(data, d => d.article_id);

		// Update()
		circles.transition()
	            .attr("cx", d => this.xScale(d.peak_date))
	            .attr("cy", d => this.yScale(d.view_count))
	            .attr("fill", d => this.color_gradient(d.view_count));

        // Enter() 
		circles.enter()
				.append("circle")
					.attr("id", d => "article_" + d.article_id)
					.attr("r", 0)
					.attr("cx", d => this.xScale(d.peak_date))
					.attr("cy", d => this.yScale(d.view_count))
					.attr("fill", d => this.color_gradient(d.view_count))
					// Tooltip behaviour
					.on("mouseover", this.onMouseOver)				
			        .on("mouseout", this.onMouseOut)
			        // Selected article behaviour
			        .on("click", this.onClick)
  				.transition()
					.attr("r", 2.5);
		
		// Exit() 
		circles.exit()
				.transition()
					.attr("r", 0)
				.remove();

		// Update x axis
		this.focus_area.select(".axis.axis-x").call(this.xAxis);
	}


	// Function to be called when user hovers over a circle - shows tooltip
	onMouseOver(d) {

		const circle = d3.select("#article_" + d.article_id);

		if (circle.classed("deleted") == false) {

			// Highlight selected circle
			d3.select("#article_" + d.article_id)
				.transition()
				.attr("r", 2.7)
				.style("stroke", "Goldenrod")
				.style("stroke-width", "0.8");

			let dateFormat = d3.timeFormat("%d %b %Y");
			let viewsFormat = d3.format(",");

			this.div = d3.select("body")
						.append("div")
					    .attr("class", "tooltip")
					    .style("opacity", 0);

	    	this.div.transition()
		            .duration(200)
		            .style("opacity", .9);

            let str = "Most viewed on: ";
            if (d.granularity != null)
            	str = "On: ";

	        this.div.html(  "<div><u>" + cleanArticleName(d.article_name) +
						  	"</u></div>" +
	        				"Total views: " + viewsFormat(d.view_count) +
	    					"<br/>" +
	        			 	str + dateFormat(d.peak_date));

	        const rect = d3.select("rect").node().getBoundingClientRect();
	        const rectTopBorder = rect.top;
	        const rectLeftBorder = rect.left;
	        const rectRightBorder = rect.right;
	        const circleLeft = $(this).offset().left;
	        const circleTop = $(this).offset().top;
	        const tooltipWidth = this.div.node().getBoundingClientRect().width;
	        const tooltipHeight = this.div.node().getBoundingClientRect().height;

	        // If the tooltip sticks out of the scatterplot's top border if
	        // placed above the circle, it is placed under the circle instead.
	        const tooltipTop = circleTop - 1.1 * tooltipHeight;
	        if (tooltipTop < rectTopBorder)
	        	this.div.style("top", circleTop + 0.4 * tooltipHeight + "px");
	        else
	        	this.div.style("top", tooltipTop + "px");
	        

	        const tooltipLeft = circleLeft - 0.4 * tooltipWidth;
			this.div.style("left", tooltipLeft + "px");
		}
    }


    // Function to be called when user stops hovering over a circle
    onMouseOut(d) {

    	const circle = d3.select("#article_" + d.article_id);

    	// Bring selected circle to its initial form
		if (circle.classed("article-clicked") != true) {

			let r = 2.5;
            if (d.granularity != null)
            	r = 2;

			circle.transition()
					.attr("r", 2.5)
					.style("stroke", "#484747")
					.style("stroke-width", "0.2");
		}

		// Hide tooltip
		this.div.transition()		
				.duration(500)
				.style("opacity", 0)
				.remove();
    }

     // Function to be called when user clicks on a circle
    onClick(d) {

    	function showArticleList() {

    		// Show list of top articles
    		d3.select("#list-top-articles")
			  .transition()
			  .duration(300)
			  .style("height", "425px");

		  	this.remove();
    	}

    	// Deselect other articles
    	const circles_clicked = d3.selectAll(".article-clicked")
    	circles_clicked.classed("article-clicked", false);

    	const circle = d3.select("#article_" + d.article_id);

		// Highlight selected circle
		circle.transition()
				.attr("r", 2.7)
				.style("stroke", "Goldenrod")
				.style("stroke-width", "0.8");
				
		circle.classed("article-clicked", true);

		// Append close button
		const close_button = d3.select("#article-summary")
							  	.append("div")
							  	.style("word_wrap", "normal")
							  	.style("width", "100%")
							  	.append("button")
						          	.attr("type", "button")
						          	.classed("btn", true)
						          	.classed("btn-light", true)
						          	.on("click", showArticleList)
					          	.append("i")
					          		.classed("fas fa-chevron-left", true);

  		close_button.text(" Show top 50 articles");

    	// Show article summary
    	d3.select("#article-summary")
    		.append("div")
			// .text(d.article_summary);   //TODO Bring back
			// TODO Remove
			.html("<br><div><u>" + cleanArticleName(d.article_name) + "</u></div>" +
				  "Lorem ipsum dolor sit amet, consectetur adipiscing" +
				  " elit, sed do eiusmod tempor incididunt ut labore" + 
				  " et dolore magna aliqua. Ut enim ad minim veniam," + 
				  " quis nostrud exercitation ullamco laboris nisi ut" + 
				  " aliquip ex ea commodo consequat. Duis aute irure" + 
				  " dolor in reprehenderit in voluptate velit esse " +
				  "cillum dolore eu fugiat nulla pariatur. " + 
				  "<a target='_blank' href='https://en.wikipedia.org/wiki/" + 
				  d.article_name + "'> (View more) </a>");


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

	  	// Hide list of top articles
		d3.select("#list-top-articles")
		  .transition()
		  .duration(200)
		  .style("height", "0px");

	   	// Show single article view
	    showArticleProgress(d.article_name);
    }

    singleArticleView(dom, data) {

    	console.log("Single article view")

    	// Expand plot domain by 2 days, so that circles
		// won't fall on the plot's borders
		// let domain = [];
		
		// domain[0] = new Date(dom[0]);
		// domain[0].setDate(domain[0].getDate() - 1);
		
		// domain[1] = new Date(dom[1]);
		// domain[1].setDate(domain[1].getDate() + 1);

		// Update xScale domain
		// this.xScale.domain(domain);

		// TODO Bring back
		// Update circles
		// let circles = this.focus_area.selectAll("circle")
		// 							 // Bind each svg circle to a 
		// 							 // unique data element
		// 							 .data(data, d => d.article_id);


		// // Update()
		// circles.transition()
	 //            .attr("cx", d => this.xScale(d.peak_date))
	 //            .attr("cy", d => this.yScale(d.view_count))
	 //            .attr("fill", d => this.color_gradient(d.view_count));


	 	// TODO Bring back
        // Enter() 
		// circles.enter()
		// 		.append("circle")
		// 			.attr("id", d => "article_" + d.article_id)
		// 			.attr("r", 0)
		// 			.attr("cx", d => this.xScale(d.peak_date))
		// 			.attr("cy", d => this.yScale(d.view_count))
		// 			.attr("fill", "#a50f15")
		// 			// Tooltip behaviour
		// 			.on("mouseover", this.onMouseOver)					
		// 	        .on("mouseout", this.onMouseOut)
  // 				.transition()
		// 			.attr("r", 2.5);

		// TODO Bring back
		// Exit() 
		// circles.exit()
		// 		.transition()
		// 			.attr("r", 0)
		// 		.remove();

		// Update x axis
		// this.focus_area.select(".axis.axis-x").call(this.xAxis);

// -----------------------------------------------------------------------

		// DOKIMI!!!!!

		// 7. d3's line generator
		let line = d3.line()
		    		.x(d => this.xScale(d.peak_date)) // set the x values for the line generator
		    		.y(d => this.yScale(d.view_count)) // set the y values for the line generator 
		    		.curve(d3.curveMonotoneX); // apply smoothing to the line

		
		// 9. Append the path, bind the data, and call the line generator 
		this.focus_area.append("path")
					    .datum(data) // 10. Binds data to the line 
					    .attr("class", "line") // Assign a class for styling 
					    .attr("d", line); // 11. Calls the line generator 

		// 12. Appends a circle for each datapoint 
		this.focus_area.selectAll(".circle")
					    .data(data)
					  	.enter()
					  		.append("circle")
								.attr("id", d => "article_" + d.article_id)
								.attr("r", 0)
								.attr("cx", d => this.xScale(d.peak_date))
								.attr("cy", d => this.yScale(d.view_count))
								.attr("fill", "#a50f15")
								// Tooltip behaviour
								.on("mouseover", this.onMouseOver)					
						        .on("mouseout", this.onMouseOut)
			  				.transition()
								.attr("r", 2);
    }
}


