
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const pageviews = [50, 0, 30, 100, 80, 45];
const years = ["2013", "2014", "2015", "2016", "2017", "2018"];
const categories = ["sport", "music", "music", "movie", "sport", "movie"]
const selected = [true, true, false, false, false, true];


class ScatterPlot {
	constructor(svg_element_id, data) {
		this.data = data;
		this.svg = d3.select("#" + svg_element_id);

		this.plot_area = this.svg.append("g");

		this.plot_area.append('rect')
			.attr("x", "0")
			.attr("y", "-10")
			.attr("width", "400")
			.attr("height", "260")
			.attr("id", "canvas");

		const x_value_range = [d3.min(data, d => d.x), d3.max(data, d => d.x)];

		const y_value_range = [0, d3.max(data, d => d.y)];

		const pointX_to_svgX = d3.scaleLinear()
			.domain(x_value_range)
			.range([10, 390]);

		const pointY_to_svgY = d3.scaleLinear()
			.domain(y_value_range)
			.range([240, 0]);


		//Scatter plot
		//-------------
		this.plot_area.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("r", 2.5) // radius
				.attr("cx", d => pointX_to_svgX(d.x)) // position, rescaled
				.attr("cy", d => pointY_to_svgY(d.y))
				.attr("class", d => d.categ)
				.classed("event-selected", d => d.sel == true); // selected events



		// Create a label for each point
		this.svg.append("g")
			.attr("class", "axis")
			.selectAll("text")
			.data(data)
			.enter()
				.append("text")
				.text( d => d.name )
				.attr("x", d => pointX_to_svgX(d.x))
				.attr("y", 260);

		// Create Y labels
		// 100 ... 20 10 0
		const label_ys = Array.from(Array(11), (elem, index) => 10 * index)
						.reverse();

		this.svg.append("g")
			.selectAll("text")
			.data(label_ys)
			.enter()
				.append("text")
				.text( svg_y => svg_y)
				.attr("x", -5)
				.attr("y", svg_y => pointY_to_svgY(svg_y));
	}
}

whenDocumentLoaded(() => {

	let data = [];

	pageviews.map((view, i) => [view, years[i], selected[i], categories[i]])
				 	 .forEach((x, i) => 
		 				data.push({"y": x[0], "x":i, "name": x[1], 
		 							"sel": x[2], "categ": x[3]}));

	const plot = new ScatterPlot("scatterplot", data);
});

