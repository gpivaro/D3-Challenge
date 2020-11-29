// circle properties
var circleRadius = 10;
var yCircleLabelOffset = 3;

// y axis min value 
var scaleMinOffset = 0.8;
var scaleMaxOffset = 1.1;

// Chart width hight aspect ratio
var widthHeightAspectRatio = 2 / 3

// Axis title offset for better location of the titles
var xAxisLabelOffset = 20;
var yAxisLabelOffset = 35;

// Tooltip label offset
var toottipVerticalPos = 0;
var toottipHorizontalPos = 95;

// Transition 
var transitionDuration = 1000

// margins
var margin = {
    left: 100,
    top: 30,
    right: 30,
    bottom: 80
};

// Initial Params for axis selection
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis, chartWidth) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * scaleMinOffset,
        d3.max(data, d => d[chosenXAxis]) * scaleMaxOffset
        ])
        .range([0, chartWidth]);

    return xLinearScale;

};

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis, chartHeight) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d[chosenYAxis]; }) * scaleMinOffset,
        d3.max(data, function (d) { return d[chosenYAxis]; }) * scaleMaxOffset
        ])
        .range([chartHeight, 0]);

    return yLinearScale;

};


// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis, chartHeight) {
    var bottomAxis = d3.axisBottom(newXScale).tickSize(-chartHeight).ticks(6);

    xAxis.transition()
        .duration(transitionDuration)
        .call(bottomAxis);

    return xAxis;
};

// function used for updating xAxis var upon click on axis label
function renderAxesY(newXScale, yAxis, chartWidth) {
    var leftAxis = d3.axisLeft(newXScale).tickSize(-chartWidth).ticks(6);

    yAxis.transition()
        .duration(transitionDuration)
        .call(leftAxis);

    return yAxis;

};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(transitionDuration)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
};

function renderCirclesText(textCircle, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    textCircle.transition()
        .duration(transitionDuration)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]) + yCircleLabelOffset);
    return textCircle;
};


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, chartGroup) {

    if (chosenXAxis === "poverty") {
        var xLabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        var xLabel = "Age (Median)";
    }
    else if (chosenXAxis === "income") {
        var xLabel = "Household Income (Median)";
    }

    if (chosenYAxis === "healthcare") {
        var yLabel = "Lacks Healthcare";
    }
    else if (chosenYAxis === "smokes") {
        var yLabel = "Smokes";
    }
    else if (chosenYAxis === "obesity") {
        var yLabel = "Obese";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([toottipVerticalPos, toottipHorizontalPos])
        .html(function (d) {
            return (`<strong>${(d.state)}</strong><br/>${xLabel +
                " " + d[chosenXAxis]}<br/>${yLabel + " " + d[chosenYAxis]}%`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    })
        // onmouseout event
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });

    return circlesGroup;
};



// main function
function makeResponsive() {


    // Get the text width size for sizing the SVG
    var element = d3.select('#textContent').node();
    var svgDivWidth = element.getBoundingClientRect().width;
    console.log(`SVG div widht = ${svgDivWidth}`);


    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the SVG
    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    };

    // svg container is variable with the browser window size
    var svgWidth = svgDivWidth;
    var svgHeigth = svgWidth * widthHeightAspectRatio;

    // chart area minus margins
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeigth - margin.top - margin.bottom;

    // create svg container
    var svg = d3.select("#scatter").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeigth)

    // shift everything over by the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Use d3 to import the data
    d3.csv("data/data.csv").then(function (data) {


        // Cast the data value to a number for each piece of data
        data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.age = +data.age;
            data.income = +data.income;
            data.smokes = +data.smokes;

        });
        // console.log(data);


        // xLinearScale function above csv import
        var xLinearScale = xScale(data, chosenXAxis, chartWidth);

        // scale y to chart height
        var yLinearScale = yScale(data, chosenYAxis, chartHeight)

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale).tickSize(-chartHeight).ticks(6);
        var leftAxis = d3.axisLeft(yLinearScale).tickSize(-chartWidth).ticks(6);


        // set the x axis to the bottom of the chart
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .attr("class", "axis")
            .call(bottomAxis)

        // set the y axis
        var yAxis = chartGroup.append("g")
            .attr("class", "axis")
            .call(leftAxis)

        // Create group for  3 x-axis labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

        // Create group for  3 y-axis labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")

        // Poverty title
        var InPovertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        // Age title
        var AgeMedianLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        // Household x title
        var IncomeMedianLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

        // Healthcare y title
        var LacksHealthcareLabel = yLabelsGroup.append("text")
            .attr("y", 0 - yAxisLabelOffset)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "healthcare") // value to grab for event listener
            .attr("text-anchor", "middle")
            // .classed("dow-text text", true)
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        // Obesity y title
        var ObesityLabel = yLabelsGroup.append("text")
            .attr("y", -40 - yAxisLabelOffset)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "obesity") // value to grab for event listener
            .attr("text-anchor", "middle")
            // .classed("dow-text text", true)
            .classed("inactive", true)
            .text("Obese (%)");

        // Obesity y title
        var SmokesLabel = yLabelsGroup.append("text")
            .attr("y", -20 - yAxisLabelOffset)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "smokes") // value to grab for event listener
            .attr("text-anchor", "middle")
            // .classed("dow-text text", true)
            .classed("inactive", true)
            .text("Smokes (%)");



        // Bind data to the circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", circleRadius)
            .classed("stateCircle", true)

        // Exit data
        circlesGroup.exit().remove();

        // Bind data to the circles
        var textCircle = chartGroup.selectAll("#stateCircle")
            .data(data).enter()
            .append("text")
            .classed("stateText", true)
            .attr("text-anchor", "middle")
            .attr("font-size", `${circleRadius}px`)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]) + yCircleLabelOffset)
            .text(d => d.abbr);
        textCircle.exit().remove();


        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, chartGroup);

        // x axis labels event listener
        xLabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // replaces chosenXAxis with value
                    chosenXAxis = value;
                    // console.log(chosenXAxis)

                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(data, chosenXAxis, chartWidth);

                    // updates x axis with transition
                    xAxis = renderAxesX(xLinearScale, xAxis, chartHeight);

                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // updates circles label with new x values
                    textCircle = renderCirclesText(textCircle, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, chartGroup);

                    // changes classes to change bold text
                    if (chosenXAxis === "poverty") {
                        InPovertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        AgeMedianLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        IncomeMedianLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "age") {
                        InPovertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        AgeMedianLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        IncomeMedianLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "income") {
                        InPovertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        AgeMedianLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        IncomeMedianLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });

        // y axis labels event listener
        yLabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {

                    // replaces chosenYAxis with value
                    chosenYAxis = value;
                    // console.log(chosenYAxis)

                    // functions here found above csv import
                    // updates y scale for new data
                    yLinearScale = yScale(data, chosenYAxis, chartHeight);

                    // updates y axis with transition
                    yAxis = renderAxesY(yLinearScale, yAxis, chartWidth);

                    // updates circles with new y values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // updates circles label with new y values
                    textCircle = renderCirclesText(textCircle, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, chartGroup);

                    // changes classes to change bold text
                    if (chosenYAxis === "healthcare") {
                        LacksHealthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        SmokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ObesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "smokes") {
                        LacksHealthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        SmokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ObesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "obesity") {
                        LacksHealthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        SmokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ObesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }

            });

    }).catch(function (error) {
        console.log(error);
    });

};

// Call the function
makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);