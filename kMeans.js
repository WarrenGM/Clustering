var clusters = [];

//Returns the euclidean distance / 2-norm between two points p and q
var dist = function(p, q) {
    return Math.sqrt((p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y));
}

var nearestCentroid = function(point, centroids) {
    nearest = 0;
    min = dist(point, clusters[0]);
    for(var i = 1; i < clusters.length; i++) {
        d = dist(point, clusters[i]);
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
    }
    return centroids;
}

var kMeans = function() {
    if(!clusters.length){
        clusters = randomCentroids();
    } else {
        for(var i = 0; i < clusters.length; i++){
            clusters[i].x = 0;
            clusters[i].y = 0;
            clusters[i].size = 0;
        }
        for(var i in data) {
            clusters[data[i].cluster].x += data[i].x;
            clusters[data[i].cluster].y += data[i].y;
            clusters[data[i].cluster].size++;
        }
         for(var i in clusters){
            if(clusters[i].size !== 0) {
                clusters[i].x /= clusters[i].size;
                clusters[i].y /= clusters[i].size;
            } else {
                clusters[i].x = Math.random()*width;
                clusters[i].y = Math.random()*height;
            }
        }
    }

    for(var i in data) {
        data[i].cluster = nearestCentroid(data[i], clusters);
    }
    
    step();
    return clusters;
}

var redrawLines = function() {
    svg.selectAll(".line").remove();
    svg.selectAll(".line").data(data)
                .enter().append("line")
                .attr("x1", function(d){ return d.x; })
                .attr("y1", function(d){ return d.y; })
                .attr("x2", function(d){ return clusters[d.cluster].x; })
                .attr("y2", function(d){ return clusters[d.cluster].y; })
                .style("stroke", color)
                .style("stroke-width", 0.5)
                .style("opacity", 0.4)
                .attr("stroke-dasharray", "5, 5")
                .attr("class", "line");
}

var step = function() {
    svg.selectAll(".point").remove();
    redrawLines();
    redrawData();
    
    var size = 6;
    svg.selectAll(".centroid").data([]).exit().remove();
    svg.selectAll("centroid")
        .data(clusters).enter().append("polygon")
                .attr("points", function(d) {
                        console.log(">_<");
                        return (d.x - size) + "," + d.y + " " +
                               d.x + "," + (d.y - size) + " " +
                               (d.x + size) + "," + d.y + " " +
                               d.x + "," + (d.y + size);
                    })
                .style("fill", "black")
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 2)
                //.style("stroke-opacity", 0.5)
                .attr("class", "centroid");
}
