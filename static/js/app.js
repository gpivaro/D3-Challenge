
// // Using d3 import the data from the csv file
// d3.csv("data/data.csv", function (myArrayOfObjects){
//   myArrayOfObjects.forEach(function (d){
//     console.log(d);
//   });

// });


// SVG dimensions
var outerWidth = 700;
var outerHeigth =  250;

var margin = { left: 30, top: 30, right: 30, bottom: 30};

var innerWidth = outerWidth - margin.left - margin.right;
var innerHeight = outerHeigth - margin.top - margin.bottom;
var circleRadius = 10;

// Define the data columns for the plot
var xColumn = "poverty";
var yColumn = "healthcare"


// Append the SVG element on the designeted place
var svg = d3.select("#scatter").append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeigth);

var g = svg.append("g")
  .attr("transform", "translate(" +  margin.left + "," + margin.top + ")");

var xAxisG = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + innerHeight + ")");

var yAxisG = g.append("g")
  .attr("class", "y axis");

// Set the linear scale of x and y
var xScale = d3.scale.linear().range([0, innerWidth]);
// Invert the y axis
var yScale = d3.scale.linear().range([innerHeight, 0]);

// Axis
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");


// Render the plot on the SVG element
// Set the domain scale to be the min and max of the x and y scales
function render(data){


  xScale.domain(d3.extent(data, function(d){return d[xColumn]; }));
  yScale.domain(d3.extent(data, function(d){return d[yColumn]; }));

  // Apply the axis
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);

  // Bind data
  var circles = g.selectAll("circle").data(data);

  // Enter
  circles.enter()
    .append("circle")
    .attr("r", circleRadius)
    .classed("stateCircle", true)


  // Update
  circles
  .attr("cx", function(d){ return xScale(d[xColumn]);})
  .attr("cy", function(d){ return yScale(d[yColumn]);});

  // Exit 
  circles.exit().remove();

};


// Load the data and parse it
function type(d){
  d.poverty = +d.poverty;
  d.healthcare = +d.healthcare;
  return d;
};


d3.csv("data/data.csv", type, render);


// // Using d3 import the data from the csv file
// d3.csv("data/data.csv", type, function (data){
//   // calculate the min and max of the object
//   var min = d3.min(data, function(d){return d.poverty; });
//   var max = d3.max(data, function(d){return d.poverty; });
//   console.log([min, max]);
// });



















// function render(data){

//   // Bind data
//   var circles = svg.selectAll("circles=").

//   // Enter
//   circles.enter().append("circle")
//   .attr("r", 10);

//   // Update
//   circles
//   .attr("cx", function(d){ return d.x})
//   .attr("cx", function(d){ return d.y})

//   // Exit 
//   circles.exit().remove();

// };





