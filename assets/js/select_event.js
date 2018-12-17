let color_stack = ["#7F4145", "#766F57", "#D2C29D", "#DEB887"]
let num_selected = 0;
const max_selected = 1;
// const cc = colorCycle(color_stack);

// TODO Unify with events.js and load_events.js(?)
function onClickEventCheckbox(id, name, event_date) {
	
	const checkbox = document.getElementById("event" + id)

	if (checkbox.checked)
		selectEvent(id, name, event_date);
	else
		deselectEvent(id);
}

function selectEvent(id, name, event_date) {

	const jumb = d3.select("#selected-events-jumb");

	// TODO Remove, if we will allow the selection of multiple events
	// Deselect previously selected events
	d3.selectAll(".badge-pill")
		.dispatch("click");

	// Get color from the top of the color stack
	const color = color_stack.pop();

	// Add event badge to jumbotron
	jumb.append("button")
			.classed("badge", true)
			.classed("badge-pill", true)
			.attr("id", "badge" + id)
			.attr("style", "background-color: " + color)
			.attr("onclick", "deselectEvent(" + id + ")")
			.text(name + " ")
		.append("i")
			.classed("fa", true)
			.classed("fa-times", true);

	// TODO Bring back if we will allow multiple selected events
	// Check if the selected events are the maximum possible, and 
	// disable all others
	// num_selected++;
	// enableDisableCheckboxes();

	// Determine event's domain
	const monthFormat = d3.timeFormat("%m");
	const yearFormat = d3.timeFormat("%Y");
	date = new Date(event_date);

	const domain = [new Date(yearFormat(date),
							 monthFormat(date) - 1,
							 1),
					new Date(yearFormat(date),
							 monthFormat(date),
							 0)];

	// Add selected event to list
	selected_events_list.push({'event_id': id, 
					  		   'domain': domain, 
				     		   'color': color});

	// Update highlighted events
	scatterplot.updateHighlightedEvents();

	// Update brush appropriately, so that the new event is included.
	brush_area.setBrushSelection(domain);
}

function deselectEvent(id) {

	const jumb = d3.select("#selected-events-jumb");
	const badge = jumb.select("#badge" + id);
	
	// Add background color back to the stack
	color_stack.push(badge.style("background-color"));

	// Remove badge from jumbotron
	badge.remove();

	// Uncheck checkbox, if not already unchecked
	d3.select("#event" + id)
	  .property("checked", false);

  	// TODO Bring back if we will allow multiple selected events 
	// Check if there are less than the maximum selected events, and 
	// re-enable all others
	// num_selected--;
	// enableDisableCheckboxes();

	// Remove event from list
	selected_events_list = selected_events_list.filter(
									e => e.event_id != id);

	// Update highligted events 
	scatterplot.updateHighlightedEvents();
}


function enableDisableCheckboxes() {

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