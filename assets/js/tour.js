let tour = {

    id: "hello-hopscotch",
    steps: [
        {
            target: "scatterplot",
            title: "Top 50 articles",
            content: "In this view, you can see the top 50 most viewed " + 
                     " Wikipedia articles for 2017-2018.",
            placement: "right",
            width: 200,
            xOffset: -30,
            showNextButton: true,
            onNext: function() {

                const domain = [];
                domain[0] = new Date(2017, 5, 1);
                domain[1] = new Date(2018, 5, 1);
                brush_area.setBrushSelection(domain);
            }
        },
        {
            target: "scatterplot",
            title: "Change selected period.",
            content: "You can view the top 50 most viewed articles " + 
                     "during some other period, by brushing " + 
                     "through the grey selector underneath the plot...",
            placement: "right",
            width: 200,
            xOffset: -30,
            yOffset: 500,
            showNextButton: true,
            onNext: function() {

                // Open left panel
                toggleNav();
                // Open social events collapsible
                d3.select("#events-social")
                  .classed("show", true);
                // TODO Change event 
                // Select event 
                d3.select("#event21")
                    .property("checked", true)
                    .dispatch("click");

            }
        },
        {
            // TODO Remove!!!!
            target: "scatterplot",
            title: "Blank",
            content: "Blank",
            placement: "right",
            width: 200,
            xOffset: -30,
            yOffset: 500,
            showNextButton: true,
            onNext: function() {
                
                const domain = [];
                domain[0] = new Date(2014, 0, 1);
                domain[1] = new Date(2018, 10, 1);
                brush_area.setBrushSelection(domain);
            }
        },
        {
            target: "scatterplot",
            title: "Select event.",
            content: "... or by selecting an event, " + 
                     " from the sidepanel on the left, to change the " + 
                     "selected period to the event's month of occurrence.",
            placement: "right",
            width: 200,
            xOffset: -30,
            showNextButton: true,
            onNext: function() {

                d3.select("#article_World_War_I")
                    .dispatch("mouseover");
            }
        },
        {
            target: "article_World_War_I",  //TODO Change appropriately
            title: "Hover",
            content: "When you hover over a circle, you can see the " + 
                     "number of total views of the article and the day, " + 
                     "on which, it was most viewed.",
            placement: "right",
            xOffset: 5,
            yOffset: -25,
            showNextButton: true,
            onNext: function() {

                d3.select("#article_World_War_I")
                  .dispatch("mouseout");
            }
        }, 
        {
            target: "article_World_War_I",  //TODO Change appropriately
            title: "Left click",
            content: "When you left click on a circle, you see the view " + 
                     "progress of the article through time.",
            placement: "right",
            xOffset: 5,
            yOffset: -25,
            showNextButton: true,
            onNext: function() {

                d3.select("#article_World_War_I")
                  .dispatch("click");
            }
        },
        {
            target: "right-panel",
            title: "Back to top 50 articles",
            content: "You can go back to the top articles view, by clicking " +
                     "on the back button.",
            placement: "left",
            showNextButton: true,
            onNext: function() {

                d3.select("#return-top-articles")
                  .dispatch("click");

                // Open left panel
                toggleNav();
            }
        },
        {
            target: "button-addon2",
            title: "Article search",
            content: "You can also see the view progress of any article " + 
                     "by searching on this search bar.",
            placement: "right",
            yOffset: -20,
            showNextButton: true
        },
        {
            target: "article_World_War_I",  //TODO Change appropriately
            title: "Right click",
            content: "Finally, by right clicking on a circle, you can see if " +
                      "any of the linked articles of this article, are also " +
                      "in the top 50.",
            placement: "right",
            xOffset: 5,
            yOffset: -25,
            showNextButton: true,
            onNext: function() {

                d3.select("#article_World_War_I")
                  .dispatch("contextmenu");
            }
        },
        {
            target: "scatterplot",
            title: "Enjoy!",
            placement: "top",
            xOffset: 550,
            yOffset: 200,
            showNextButton: true
        }
    ]
};

// Start the tour!
$(document).ready(function() {
    hopscotch.startTour(tour);
});