var data = [];
var width = 800, height = 600;
var scaleX = d3.scale.linear().domain([0, 1]).range([0, width]),
    scaleY = d3.scale.linear().domain([0, 1]).range([0, height]),
    scaleColor = d3.scale.ordinal().domain([-1,0,1,2,3,4,5])
                                        .range(["green", "yellow", "red"]);
                                        
var clusteredPoints = function(n, k) {
    n = n || 1000;
    k = k || 2 + Math.random()*10;
    
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
        var center = clusters[Math.floor(Math.random() * k)];
        
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
    property = property || "cluster";
    if(d.cluster === -1) {
        return "black";
    }
    var colors = ["red", "green", "blue", "gold", "purple", "orange", "cyan",
                  "brown", "chartreuse"];
    return colors[d.cluster % colors.length]
}

var refresh = function() {
    centroids = []; //TODO move
    svg.selectAll(".centroid").data([]).exit().remove();
    
    console.log("refreshing");
    svg.selectAll(".point")
        .data([]).exit().remove();
        
    n = document.getElementById("n").value;
    k = document.getElementById("k").value;
    data = clusteredPoints(n, k);
    svg.selectAll("circle")
        .data(data).enter().append("circle")
                .attr("r", 2)
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
                .style("fill", color)
                .attr("class", "point");
                
    svg.selectAll("circle")
        .data([1]).enter().append("circle")
                .attr("r", 10)
                .attr("cx", 100)
                .attr("cy", 100)
                .style("fill", "Maroon");
}