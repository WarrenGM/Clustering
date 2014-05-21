var centroids = [];

//Returns the euclidean distance / 2-norm between two points p and q
var dist = function(p, q) {
    return Math.sqrt((p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y));
}

var nearestCentroid = function(point, centroids) {
    nearest = 0;
    min = dist(point, centroids[0]);
    for(var i = 1; i < centroids.length; i++) {
        d = dist(point, centroids[i]);
        if(d < min) {
            nearest = i;
            min = d;
        }
    }
    return nearest;
}

var randomCentroids = function() {
    k = document.getElementById("k").value; //TODO
    centroids = [];
    for(var i = 0; i < k; i++) {
        centroids[i] = {
            "x" : Math.random()*width,
            "y" : Math.random()*height,
            "size" : 0
        }
        console.log("RC: " + centroids[i]);
        for(var j in centroids[i]){
            console.log(j);
        }
    }
    return centroids;
}

var kMeans = function() {
    if(!centroids.length){
        centroids = randomCentroids();
    } else {
        for(var i in centroids){
            centroids[i].x = 0;
            centroids[i].y = 0;
            centroids[i].size = 0;
        }
        for(var i in data) {
            centroids[data[i].cluster].x += data[i].x;
            centroids[data[i].cluster].y += data[i].y;
            centroids[data[i].cluster].size++;
        }
         for(var i in centroids){
            if(centroids[i].size !== 0) {
                centroids[i].x /= centroids[i].size;
                centroids[i].y /= centroids[i].size;
            } else {
                centroids[i].x = Math.random()*width;
                centroids[i].y = Math.random()*height;
            }
        }
    }

    for(var i in data) {
        data[i].cluster = nearestCentroid(data[i], centroids);
    }
    
    step();
    return centroids;
}

var redrawLines = function() {
    svg.selectAll(".line").remove();
    svg.selectAll(".line").data(data)
                .enter().append("line")
                .attr("x1", function(d){ return d.x; })
                .attr("y1", function(d){ return d.y; })
                .attr("x2", function(d){ return centroids[d.cluster].x; })
                .attr("y2", function(d){ return centroids[d.cluster].y; })
                .style("stroke", color)
                .style("stroke-width", 0.5)
                .style("opacity", 0.3)
                .attr("stroke-dasharray", "5, 5")
                .attr("class", "line");
}

var step = function() {
    svg.selectAll(".point").remove();
    redrawLines();
    redrawData();
    
    var size = 4;
    svg.selectAll(".centroid").data([]).exit().remove();
    svg.selectAll("centroid")
        .data(centroids).enter().append("polygon")
                .attr("points", function(d) {
                        return (d.x - size) + "," + d.y + " " +
                               d.x + "," + (d.y - size) + " " +
                               (d.x + size) + "," + d.y + " " +
                               d.x + "," + (d.y + size);
                    })
                .style("fill", function(d, i){ return color(d, i); })
                .attr("class", "centroid");
}
