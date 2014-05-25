var clusterData = function(cluster) {
    var clusterFilter = function(d) { return d.cluster === cluster; };
    return data.filter(clusterFilter);
}

// TODO concave hull for DBSCAN
var hull = function(cluster, concavity) {
    var clusterFilter = function(d) { return d.cluster === cluster; };
    var quadtree = d3.geom.quadtree(data.filter(clusterFilter));
    quadtree.x = function(d) { return d.x; }
    quadtree.y = function(d) { return d.y; }
    
    return convexHull(clusterData(cluster));
}

var hullToString = function(hull) {
    var points = "";
    for(var i = 0; i < hull.length; i++) {
        points += hull[i].x + "," + hull[i].y + " ";
    }
    return points;
}

// Returns the perpendiculear component of OP x OQ (the cross product
// of the vectors from O to P and O to Q)
var cross = function(o, p, q) {
    return (p.x - o.x)*(q.y - o.y) - (p.y - o.y)*(q.x - o.x);
}

// Returns an array of points defining a convex hull using Graham Scan
var convexHull = function(cluster) {
    if(cluster.length < 4) {
        return cluster;
    }

    var minY = 0;
    for(var i = 1; i < cluster.length; i++) {
        if(cluster[i].y < cluster[minY].y) {
            minY = i;
        } else if(cluster[i].y === cluster[minY].y) {
            if(cluster[i].x < cluster[minY].x) {
                minY = i;
            }
        }
    }
    
    var pivot = cluster[minY]
    var refPoint = {"x" : pivot.x + 100,
                    "y" : pivot.y };
    
    var angle = function(p) {
        var dot = (refPoint.x - pivot.x)*(p.x - pivot.x) //dot product
                + (refPoint.y - pivot.y)*(p.y - pivot.y);
        var norm = dist(pivot, refPoint) * dist(pivot, p);
        
        return Math.acos(dot/norm) || 0;
    }
    
    var compare = function (p, q) {
        return angle(p) - angle(q);
    }
    cluster.sort(compare);
    
    var hull = [cluster[0], cluster[1], cluster[2]];
    for(var i = 2; i < cluster.length; i++) {
        var l = hull.length;
        while(cross(hull[l - 2], hull[l - 1], cluster[i]) <= 0 && l >= 2) {
            hull.pop();
            l--;
        }
        hull.push(cluster[i]);
    }
    return hull;
}

var displayHull = function() {
    if(document.getElementById("hullBox").checked) {
        if(clusters.length === 0) {
            document.getElementById("hullBox").checked = false;
        }
        svg.selectAll("centroid")
            .data(clusters).enter().append("polygon")
                .attr("points", function(d, i) {
                        return hullToString(hull(i));
                    })
                .style("fill", function(d, i){ return color(i); })
                .style("opacity", 1)
                .style("stroke", "black")
                .style("stroke-width", 2)
                .attr("class", "hull");
    } else {
        svg.selectAll(".hull").remove();
    }
}