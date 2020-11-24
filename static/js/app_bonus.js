
// svg container
var svgWidth = 700;
var svgHeigth = 450;


// margins
var margin = { left: 80, top: 30, right: 30, bottom: 80 };

// chart area minus margins
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeigth - margin.top - margin.bottom;

// create svg container
var svg = d3.select("#scatter").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeigth);

// shift everything over by the margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// circle properties
var circleRadius = 12;

// Define the data columns for the plot
var xColumn = "poverty";
var yColumn = "healthcare"

// Use d3 to import the data
d3.csv("data/data.csv").then(function (data) {

    // Print the csv imported data
    console.log(data);

    // Cast the data value to a number for each piece of data
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // scale y to chart height
    var yScale = d3.scaleLinear()
        .domain([3, 1.1 * d3.max(data, function (d) { return d[yColumn]; })])
        .range([chartHeight, 0]);

    // scale x to chart width
    var xScale = d3.scaleLinear()
        .domain([8.5, 1.1 * d3.max(data, function (d) { return d[xColumn]; })])
        .range([0, chartWidth]);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);


    // set the x axis to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)

    // set the y axis
    chartGroup.append("g")
        .call(yAxis)


    // Bind data to the circles
    var circles = chartGroup.selectAll("circle").data(data);

    // Enter data
    circles.enter()
        .append("circle")
        .attr("r", circleRadius)
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d[xColumn]))
        .attr("cy", d => yScale(d[yColumn]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d[yColumn]))
    // .append("text")
    // .attr("x", d => xScale(d[xColumn]))
    // .attr("y", d => yScale(d[yColumn]))
    // .text("A");



    // Exit data
    circles.exit().remove();


    // //Add the SVG Text Element to the group
    // var text = chartGroup.selectAll("circle").data(data);

    // //Add SVG Text Element Attributes
    // text.enter()
    //     .append("text")
    //     .classed("stateText", true)
    //     .attr("x", d => xScale(d[xColumn]))
    //     .attr("y", d => yScale(d[yColumn]))
    //     .text("a")
    //     .attr("font-size", `${circleRadius}px`);





}).catch(function (error) {
    console.log(error);
});










// // Circle properties
// var circleRadius = 12;
// var xCircleLabelOffset = circleRadius / 1.5;
// var yCircleLabelOffset = circleRadius / 4;

// // Define the data columns for the plot
// var xColumn = "poverty";
// var yColumn = "healthcare"

// // Axis properties
// var xAxisLabelText = "In Poverty (%)";
// var xAxisLabelOffset = 55;
// var yAxisLabelText = "Lack Healthcare (%)";
// var yAxisLabelOffset = 45;





// // Set the linear scale of x and y
// // var xScale = d3.scale.linear().range([0, chartWidth]);
// var xScale = d3.scaleLinear().range([0, chartWidth]);
// // Invert the y axis
// // var yScale = d3.scale.linear().range([chartHeight, 0]);
// var yScale = d3.scaleLinear().range([chart
// Height, 0]);

// // Define the xaxis property
// var xAxisG = g.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + chart
// Height + ")");

// // Define the yaxis property
// var yAxisG = g.append("g")
//     .attr("class", "y axis");

// // Add xaxis labels
// var xAxisLabel = xAxisG.append("text")
//     .style("text-anchor", "middle")
//     .attr("transform", "translate(" + (chartWidth / 2) + "," + xAxisLabelOffset + ")")
//     .attr("class", "label")
//     .text(xAxisLabelText);

// // Add yaxis labels
// var yAxisLabel = yAxisG.append("text")
//     .style("text-anchor", "middle")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - yAxisLabelOffset)
//     .attr("x", 0 - (chart
//     Height / 2))
//     .attr("class", "label")
//     .text(yAxisLabelText);

// // Define the axis scale
// // var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
// var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
// // var yAxis = d3.svg.axis().scale(yScale).orient("left");
// var yAxis = d3.svg.axis().scale(yScale).orient("left");

// // Render the plot on the SVG element
// function render(data) {

//     // Set the domain scale to be the min and max of the x and y scales
//     xScale.domain(d3.extent(data, function (d) { return d[xColumn]; }));
//     yScale.domain(d3.extent(data, function (d) { return d[yColumn]; }));


//     // Apply the axis
//     xAxisG.call(xAxis);
//     yAxisG.call(yAxis);

//     // Bind data to the circles
//     var circles = g.selectAll("circle").data(data);

//     // Enter data
//     circles.enter()
//         .append("circle")
//         .attr("r", circleRadius)
//         .classed("stateCircle", true)

//     // Update data
//     circles
//         .attr("cx", function (d) { return xScale(d[xColumn]); })
//         .attr("cy", function (d) { return yScale(d[yColumn]); });


//     // Exit data
//     circles.exit().remove();


//     //Add the SVG Text Element to the group
//     var text = g.selectAll("circles")
//         .data(data)
//         .enter()
//         .append("text");

//     //Add SVG Text Element Attributes
//     var textLabels = text
//         .attr("x", function (d) { return (xScale(d[xColumn]) - xCircleLabelOffset); })
//         .attr("y", function (d) { return (yScale(d[yColumn]) + yCircleLabelOffset); })
//         .text(function (d) { return d['abbr']; })
//         .classed("stateText", true)
//         .attr("font-size", `${circleRadius}px`);











