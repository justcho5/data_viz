let color_stack = ["#F0EAD6", "#D2C29D", "#766F57", "#7F4145"];
let num_selected = 0;
const max_selected = 4;

// TODO Unify with events.js and load_events.js(?)
function select_event(id, name, event_date) {
	
	const jumb = d3.select("#selected-events-jumb");
	const checkbox = document.getElementById("event" + id)

	if (checkbox.checked) {

		// Get color from the top of the color stack
		const color = color_stack.pop();

		// Add event badge to jumbotron
		jumb.append("button")
				.classed("badge", true)
				.classed("badge-pill", true)
				.attr("id", "badge" + id)
				.attr("style", "background-color: " + color)
				.attr("onclick", "remove_badge(" + id + ")")
				.text(name + " ")
			.append("i")
				.classed("fa", true)
				.classed("fa-times", true);

		// Check if there are 4 selected events, and disable all others
		num_selected++;
		toggle_checkboxes();

		// Update brush appropriately
		const monthFormat = d3.timeFormat("%m");
		const yearFormat = d3.timeFormat("%Y");
		date = new Date(event_date);

		const domain = [new Date(yearFormat(date),
								 monthFormat(date) - 1,
								 1),
						new Date(yearFormat(date),
								 monthFormat(date),
								 0)];

		// Update brush selection, so that new event is included.
		brush_area.setBrushSelection(domain);

		//TODO Just put beginning and end of month instead
		// Highlight 15 days before and after event on timeline
		highlight_dates = [];
		// highlight_dates[0] = new Date(yearFormat(date), monthFormat(date),
		// 			date.getDate() - 15);
		// highlight_dates[1] = new Date(yearFormat(date), monthFormat(date),
		// 			date.getDate() + 15);

		highlight_dates[0] = domain[0];
		highlight_dates[1] = domain[1];

		scatterplot.highlightPartOfAxis(highlight_dates, color);


	} else {

		const badge = jumb.select("#badge" + id);
		
		// Add background color back to the stack
		color_stack.push(badge.style("background-color"));

		// Remove badge from jumbotron
		badge.remove();

		// Check if there are less than 4 selected events, and re-enable all 
		// others
		num_selected--;
		toggle_checkboxes();
	}
}


function remove_badge(id) {

	const badge = d3.select("#selected-events-jumb")
					.select("#badge" + id);

	// Add background color back to the stack
	color_stack.push(badge.style("background-color"));

	badge.remove();

	d3.select("#event" + id)
		.property("checked", false);


	// Check if there are less than 4 selected events, and re-enable all 
	// others
	num_selected--;
	toggle_checkboxes();
}


function toggle_checkboxes() {

	if (num_selected >= max_selected) {

		d3.selectAll(".event-checkbox")
			.selectAll("input[type='checkbox']:not(:checked)")
			.property("disabled", true);

	} else if (num_selected == max_selected - 1) {

		d3.selectAll(".event-checkbox")
			.selectAll("input[type='checkbox']")
			.property("disabled", false);
	}
}