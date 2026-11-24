// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// WireTool demo:
// A line from x=0 to x=10, which prints each point that's added as a callback



//@input Asset.Material lineMaterial



const line = new WireTool.Create();

// callback example
line.onPointsAdded.add(function(points){ // whenever a point is added
    for(var i = 0; i < points.length; i++){ // for each new point
        print('point added: ' + points[i].position.toString()); // print the point's position


        // tip: this position is in local space.
        // that doesn't make a difference in this case, but when the line's SceneObject is transformed, you can convert local space positions to world space like so:
        //      line.localToWorld(points[i].position) → world space position
        
    }
});

// making a simple line
line.radius = 0.2; // thin line (1cm radius)
line.addPoints(new vec3(-10, 0, 0)); // 1st point at -10
line.addPoints(new vec3(10, 0, 0)); // 2nd point at 10
line.addPoints(new vec3(10, 10, 0)); // 2nd point at 10

// adding a material
line.setMaterials(script.lineMaterial);