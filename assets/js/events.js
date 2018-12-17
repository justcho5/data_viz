const categories = ["Politics", "Social", "Science", "Sports", "Viral"];


// TODO Unify with select_events.js and load_events.js(?)
class Events {

	constructor(events) {

		this.events = events;

		// Append a checkbox for each event, in the appropriate category
		categories.map(categ => this.events.filter(
											x => x.event_category === categ))
					.forEach(function(arr, index) {

			const li = d3.select("#events-" + categories[index].toLowerCase())
						.select(".card-body")
						.select("ul")
						.selectAll(".event-checkbox")
						.data(arr, d => d.event_id);
						
			// Enter()
			const li_enter = li.enter()
								.append("li")
									.classed("list-group-item", true)
									.classed("event-checkbox", true)
									.classed("inline-field", true);
						
			li_enter.append("input")
					.attr("type", "checkbox")
					.attr("id", d => "event" + d.event_id)
					.attr("onclick", 
						d => "onClickEventCheckbox('" + d.event_id + "', '" 
											 		+ d.event_name + "', '"
											 		+ d.event_date + "')");

			li_enter.append("label")
					.attr("for", d => "event" + d.event_id)
					.text(d => d.event_name + 
						" [" + d.event_month + " " + d.event_year +"]");

			// Exit()
			li.exit()
				.remove();
		});
	}
}