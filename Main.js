/**
 *  Contains code to initialize the page, interact with input and manage 
 *  the different algorithms
 */

var data = [];
var width = 800, height = 600;
var scaleX = d3.scale.linear().domain([0, 1]).range([0, width]),
    scaleY = d3.scale.linear().domain([0, 1]).range([0, height]),
    scaleColor = d3.scale.ordinal().domain([-1,0,1,2,3,4,5])
                                        .range(["green", "yellow", "red"]);
                                        
var clusteredPoints = function(n) {
    n = n || 1000;
    var k = 1 + Math.random()*10;
    
    //Generates the center of the clusters
    var clusters = [];
    for(var i = 0; i < k; i++) {
        clusters[i] = {
            "x" : scaleX(Math.random()),
            "y" : scaleY(Math.random()),
            "rx" : width/10 + Math.random()*width/2, //radius x
            "ry" : height/10 + Math.random()*height/2, //radius y
        }
    }
    
    // returns an roughly normally distributed random number between a and b
    // with mean equal to the average of a and b.
    var rand = function(a, b) { 
        return a + (Math.random() + Math.random() + Math.random())*(b - a)/3;
    }
    
    var d = [];
    for(var i = 0; i < n; i++) {
        var center = clusters[Math.floor((Math.random() + Math.random()) * k / 2)];
        
        d[i] = {
            "x" : rand(Math.max(0, center.x - center.rx), 
                       Math.min(width, center.x + center.rx)),
            "y" : rand(Math.max(0, center.y - center.ry), 
                       Math.min(height, center.y + center.ry)),
            "cluster" : -1
        }
    }
    return d;
}

var color = function(d, property) {
    property = "cluster";
    
    if(d.cluster === -1) {
        return "black";
    }
    var phi = 0.61803398875; //Golden ratio minus one
    var c = d.cluster;
    var h = 360*(c * phi - Math.floor(c*phi));
    return "hsl(" + h + ", 100%, 35%)";
}

var redrawData = function() {
    var points = svg.selectAll(".point").data(data, function(d){ return d.x; });
    points.enter().append("circle")
                .attr("r", 3)
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
                .style("fill", color)
                .style("stroke", "black")
                .style("opacity", 0.8)
                .attr("class", "point");
    points.exit().remove();
}

var generateData = function() {
    n = document.getElementById("n").value;
    k = document.getElementById("k").value;
    data = clusteredPoints(n, k);
    
    redrawData();
}

var resetAlgos = function() {
    centroids = [];
    svg.selectAll(".centroid").remove();
    svg.selectAll(".line").remove();
}

var refresh = function() {
    resetAlgos();
    generateData();
}