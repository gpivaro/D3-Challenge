
// Define the svg dimensions
var outerWidth = 700;
var outerHeigth = 450;
var margin = { left: 30, top: 30, right: 30, bottom: 80 };

// Define the inner frame dimension
var innerWidth = outerWidth - margin.left - margin.right;
var innerHeight = outerHeigth - margin.top - margin.bottom;
var circleRadius = 10;

// Define the data columns for the plot
var xColumn = "poverty";
var yColumn = "healthcare"

// Axis properties
var xAxisLabelText = "In Poverty (%)";
var xAxisLabelOffset = 55;
var yAxisLabelText = "Lack Healthcare (%)";
var yAxisLabelOffset = 55;

// Append the svg element on the designeted place
var svg = d3.select("#scatter").append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeigth);

// create a svg group element
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the linear scale of x and y
var xScale = d3.scale.linear().range([0, innerWidth]);
// Invert the y axis
var yScale = d3.scale.linear().range([innerHeight, 0]);

// Define the xaxis property
var xAxisG = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + innerHeight + ")");

// Define the yaxis property
var yAxisG = g.append("g")
  .attr("class", "y axis");

// Add xaxis labels
var xAxisLabel = xAxisG.append("text")
  .style("text-anchor", "middle")
  .attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
  .attr("class", "label")
  .text(xAxisLabelText);

// Add yaxis labels
var yAxisLabel = yAxisG.append("text")
  .style("text-anchor", "middle")
  .attr("transform", "translate(" + yAxisLabelOffset + "," + (innerHeight / 2) + ")")
  .attr("class", "label")
  .text(yAxisLabelText);

// Define the axis scale
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

// Render the plot on the SVG element
function render(data) {

  // Set the domain scale to be the min and max of the x and y scales
  xScale.domain(d3.extent(data, function (d) { return d[xColumn]; }));
  yScale.domain(d3.extent(data, function (d) { return d[yColumn]; }));

  // Apply the axis
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);

  // Bind data to the circles
  var circles = g.selectAll("circle").data(data);

  // Enter data
  circles.enter()
    .append("circle")
    .attr("r", circleRadius)
    .classed("stateCircle", true)
    .text("Text")

  // Update data
  circles
    .attr("cx", function (d) { return xScale(d[xColumn]); })
    .attr("cy", function (d) { return yScale(d[yColumn]); });

  // Exit data
  circles.exit().remove();

};

//  Parse the data
function type(d) {
  d.poverty = +d.poverty;
  d.healthcare = +d.healthcare;
  return d;
};

// Call the function
d3.csv("data/data.csv", type, render);