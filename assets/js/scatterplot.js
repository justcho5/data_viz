class ScatterPlot {

	constructor(svg_element_id, data, width, height) {
		
		// Ranges & Scales
		const xRange = [new Date(2012, 11, 1), new Date(2018, 1, 1)];
		const yRange = [0, (d3.max(data, d => d.view_count)) + 100000];

		this.xScale = d3.scaleTime()
							.domain(xRange)
							.range([0, width - 1]);
		this.yScale = d3.scaleLinear()
							.domain(yRange)
							.range([height - 10, -10]);

		// Color gradient for datapoints based on y scale
		const grad_scale = this.yScale.domain()[1]
		const colors = ["#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15"] 
		this.color_gradient = d3.scaleLinear()
						.domain(d3.ticks(0, grad_scale, 5))
						.range(colors);

		//Create scatterplot and surrounding g elements
		const svg = d3.select("#" + svg_element_id);

		this.focus_area = svg.append("g")
								.classed("focus", true);

		this.focus_area.append('rect')
					.attr("x", "0")
					.attr("y", "-10")
					.attr("width", width)
					.attr("height", height)
					.attr("id", "canvas")
					.attr("fill", "#FFFFFF");
					// .classed("zoom", true);

		// Create X axis
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
					    });


		//JUSTINA			    
		let legend_data = d3.range(this.yScale.domain())
		let defs = this.focus_area.append('defs');
		let linearGradient = defs.append('linearGradient')
						.attr('id', 'linear-gradient');

		linearGradient
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "100%")

		linearGradient.selectAll("stop")
			.data([
			{offset: "0%", color: colors[4]},
			{offset: "25%", color: colors[3]},
			{offset: "50%", color: colors[2]},
			{offset: "75%", color: colors[1]},
			{offset: "100%", color: colors[0]},




			])
			.enter().append("stop")
			.attr("offset", function(d) { 
			return d.offset; 
			})
			.attr("stop-color", function(d) { 
			return d.color; 
			});
		// this.focus_area.append("g")
		// 				.classed("axis axis-y", true)
		// 	      		.call(this.yAxis)
		// 	      		.style('color', 'red')
      	 this.focus_area.append("rect")
      	 				.attr("x", 0)
      	 				.attr("y", -10)
      	 				.attr("width", 10)
      	 				.attr("height", height)
      	 				.style("fill", "url(#linear-gradient)");

		let yLeg = d3.scaleLinear()
						.domain(this.yScale.domain())
						.range([height-10,-10])
		let axisLeg = d3.axisLeft(yLeg)
						.tickValues(this.color_gradient.domain())

		this.focus_area.attr("class", "axis")
						.append("g")
						.attr("transform","translate(0,0)")
						.call(axisLeg);


		// Create article circles
		let circles = this.focus_area
							.selectAll("circle")
							// Bind each svg circle to a unique data element
							.data(data, d => d.article_id);
		circles.enter()	
				.append("circle")
					.attr("r", 2.5)
					.attr("cx", d => this.xScale(d.peak_date))
					.attr("cy", d => this.yScale(d.view_count))
					.attr("fill", d => this.color_gradient(d.view_count))
					.attr("class", d => d.main_category.toLowerCase())
					// Tooltip behaviour
					.on("mouseover", this.onMouseOver)					
			        .on("mouseout", this.onMouseOut)
					// Selected article behaviour
					// .classed("article-selected", d => d.sel == true);
					.classed("article-selected", d => d);

		//JUSTINA

	}

	// Function to be called when user hovers over a circle - shows tooltip
	onMouseOver(d) {

		let dateFormat = d3.timeFormat("%d %b %Y");
		let viewsFormat = d3.format(",");

		this.div = d3.select("body")
					.append("div")
				    .attr("class", "tooltip")
				    .style("opacity", 0);

    	this.div.transition()
	            .duration(200)
	            .style("opacity", .9);

        this.div.html(  "<div><u>" + d.article_name
        							.replace(/_/g, " ") //Remove _
									.replace(/\\/g, "") //Remove \
							  + "</u></div>" +
        				"Total views: " + viewsFormat(d.view_count) +
    					"<br/>" +
        			 	"Most viewed on: " + dateFormat(d.peak_date));

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

    // Function to be called when user stops hovering over a circle
    onMouseOut(d) {

		this.div.transition()		
				.duration(500)
				.style("opacity", 0)
				.remove();
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
	            .attr("cy", d => this.yScale(d.view_count));

        // Enter() 

		circles.enter()
				.append("circle")
					.attr("r", 0)
					.attr("cx", d => this.xScale(d.peak_date))
					.attr("cy", d => this.yScale(d.view_count))
					.attr("fill", d => this.color_gradient(d.view_count))
					.attr("class", d => d.main_category.toLowerCase())
					// Tooltip behaviour
					.on("mouseover", this.onMouseOver)					
			        .on("mouseout", this.onMouseOut)
					// selected articles
					// .classed("article-selected", d => d.sel == true);
					.classed("article-selected", d => d)
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
}


