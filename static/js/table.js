
// Define the data columns for the plot
    var xColumn = "poverty";
    var yColumn = "healthcare"

    // Use d3 to import the data
d3.csv("data/data.csv").then(function (data) {
    // Insert a table
    d3.select("table")
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
    .html(function (d) {
        return `<td>${d.abbr}</td><td>${d[xColumn]}</td><td>${d[yColumn]}</td>`;
    });



}).catch(function (error) {
    console.log(error);
});
