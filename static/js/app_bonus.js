
// main function
function makeResponsive() {

    // circle properties
    var circleRadius = 10;
    var yCircleLabelOffset = 3;

    // Define the data columns for the plot
    var yColumn = "healthcare"
    // Initial Params for axis selection
    var chosenXAxis = "poverty";

    // y axis min value 
    var yScaleMin = 3;
    var yscaleMaxOffset = 1.1;

    // Chart width hight aspect ratio
    var widthHeightAspectRatio = 2 / 3

    // Axis title offset for better location of the titles
    var xAxisLabelOffset = 20;
    var yAxisLabelOffset = 35;

    // Tooltip label offset
    var toottipVerticalPos = 0;
    var toottipHorizontalPos = 95;

    // margins
    var margin = {
        left: 80,
        top: 30,
        right: 30,
        bottom: 80
    };

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


    // function used for updating x-scale var upon click on axis label
    function xScale(data, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, chartWidth]);

        return xLinearScale;

    };

    // function used for updating xAxis var upon click on axis label
    function renderAxesX(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale).tickSize(-chartHeight).ticks(6);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    };

    // function used for updating xAxis var upon click on axis label
    function renderAxesY(newXScale, yAxis) {
        var leftAxis = d3.axisLeft(newXScale).tickSize(-chartWidth).ticks(6);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;

    };

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXaxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));

        return circlesGroup;
    };

    function renderCirclesText(textCircle, newXScale, chosenXaxis) {

        textCircle.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]));

        return textCircle;
    };




    // // function used for updating circles label group with a transition to
    // // new circles
    // function renderCirclesLabel(circlesLabel, data, newXScale, yLinearScale, chosenXAxis) {

    //     var circlesLabel = chartGroup.selectAll("circles");

    //     //Add SVG Text Element Attributes
    //     circlesLabel
    //         .data(data)
    //         .enter()
    //         .merge(circlesLabel)
    //         .append("text")
    //         .classed("stateText", true)
    //         .attr("text-anchor", "middle")
    //         .attr("x", d => newXScale(d[chosenXAxis]))
    //         .attr("y", d => yLinearScale(d[yColumn]) + yCircleLabelOffset)
    //         .text(d => `${d.abbr}`)
    //         .attr("font-size", `${circleRadius}px`);
    //     circlesLabel.exit().remove();

    //     // // // console.log(circlesLabel);
    //     // circlesLabel.transition()
    //     //     .duration(1000)
    //     //     .attr("x", d => newXScale(d[chosenXAxis]))
    //     //     .attr("y", d => yLinearScale(d[yColumn]) + yCircleLabelOffset)
    //     //     .text(d => `${d.abbr}`)
    //     //     .attr("font-size", `${circleRadius}px`);


    //     return circlesLabel;
    // };


    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

        if (chosenXAxis === "poverty") {
            var label = "In Poverty (%)";
        }
        else if (chosenXAxis === "age") {
            var label = "Age (Median)";
        }
        else if (chosenXAxis === "income") {
            var label = "Household Income (Median)";
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([0, 95])
            .html(function (d) {
                return (`<strong>${(d.state)}</strong><br/>${label + " " + d[chosenXAxis]}<br/>Lacks Healthcare ${d.healthcare}%`);
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



    // Use d3 to import the data
    d3.csv("data/data.csv").then(function (data) {


        console.log(data);

        // Cast the data value to a number for each piece of data
        data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.age = +data.age;
            data.income = +data.income;
            data.smokes = +data.smokes;

        });

        // xLinearScale function above csv import
        var xLinearScale = xScale(data, chosenXAxis);


        // scale y to chart height with 10% over the max
        var yLinearScale = d3.scaleLinear()
            .domain([yScaleMin, yscaleMaxOffset * d3.max(data, function (d) { return d[yColumn]; })])
            .range([chartHeight, 0])
            .nice();


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

        // Create group for  3 x- axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

        // Poverty title
        var InPovertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");

        // Age title
        var AgeMedianLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        // Household x title
        var IncomeMedianLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Median)");

        // append y axis label
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - yAxisLabelOffset)
            .attr("x", 0 - (chartHeight / 2))
            .attr("text-anchor", "middle")
            .classed("dow-text text", true)
            .text("Lacks Healthcare (%)");


        // Bind data to the circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[yColumn]))
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
            .attr("y", d => yLinearScale(d[yColumn]) + yCircleLabelOffset)
            .text(d => d.abbr);
        textCircle.exit().remove();


        // var circlesLabel = chartGroup.selectAll("circles");

        // //Add SVG Text Element Attributes
        // circlesLabel
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .classed("stateText", true)
        //     .attr("text-anchor", "middle")
        //     .attr("x", d => xLinearScale(d[chosenXAxis]))
        //     .attr("y", d => yLinearScale(d[yColumn]) + yCircleLabelOffset)
        //     .text(d => `${d.abbr}`)
        //     .attr("font-size", `${circleRadius}px`);

        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // x axis labels event listener
        labelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // replaces chosenXAxis with value
                    chosenXAxis = value;
                    // console.log(chosenXAxis)

                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(data, chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderAxesX(xLinearScale, xAxis);

                    // updates x axis with transition
                    // yAxis = renderAxesY(xLinearScale, yAxis);

                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    // updates circles label   with new x values
                    // circlesLabel = renderCirclesLabel(circlesLabel, data, xLinearScale, yLinearScale, chosenXAxis);
                    textCircle = renderCirclesText(textCircle, xLinearScale, chosenXAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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



    }).catch(function (error) {
        console.log(error);
    });

};

// Call the function
makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);