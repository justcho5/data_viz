class ArticleList {

	constructor(article_list_id, data) {

		this.article_list_id = article_list_id;
		this.updateArticleList(data);
	}

	updateArticleList(data) {

		// Add a <li> element for each article
		const article_list = d3.select("#" + this.article_list_id)
							   .select(".scrollable");
		const u = article_list.selectAll(".article-li")
								.data(data, d => d.view_count);

		// Enter()
		u.enter()
			.append("li")
			.classed("article-li", true)
			.text((d, i) => (i+1) + ". " + 
							cleanArticleName(d.article_name))
			.classed("list-group-item", true)
			.classed("hyphenated", true);

		// Exit()
		u.exit()
			.remove();
	}
}