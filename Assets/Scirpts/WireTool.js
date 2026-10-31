// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// WireTool 1.0
// maxvanleeuwen.com/wiretool
//
//  WireTool creates continuous 3D geometry, based on given world positions.
//  Useful for cylindrical geometry, animated trails, special effects and other unique visuals!
//  Check out all the examples that come with the download!
//
//  To keep it as performance-friendly as possible (especially when rendering lots of wires simultaneously), see the 'Tips & Tricks' section!
//  You'll also find some helpful notes on working with shaders there.



// Quickstart
//
//      // a new instance
//      var wire = new WireTool.Create()
//      wire.radius = 1 // custom radius
//
//        // function that prints the current point count
//        function printPointCount(){
//          print(wire.getLocalPoints().length)
//        }
//        // bind to callback (for demonstration purposes)
//        wire.onPointsAdded.add(printPointCount)
//
//      // add two points, x=0 and x=10 - this renders a horizontal tube
//      wire.addPoints(new vec3(0, 0, 0), new vec3(10, 0, 0))
//
//      // (the total amount of points (2) will be printed to the logger because of the callback)
//
//
//
// Usage
//      
//      -> drawing                                  > points can simply be vec3 world positions, OR they can be objects containing: { position:vec3, *direction:vec3(normalized), *color:vec4, *radius:number } (* = optional)
//      .addPoints( ...points )                     append points to this wire (...vec3/objects, any number of arguments)
//      .replace( ...points )                       clear and add new points (...vec3/objects, any number of arguments)
//
//
//      -> callbacks                                > bind functions to callbacks using .add(function) and .remove(function)!
//      .onPointsAdded                              event: on new points added to wire (and passed the stepDistance filter)
//                                                      - callback arguments: an array of the passed-in point objects (local), containing: { position:vec3, distance:number, color:vec4, radius:number }
//
//
//      -> customization
//      .setPointLimit( number )                    set a point limit, oldest points will be removed when exceeded (int, default: 500)
//      .setLengthLimit( number )                   set a length limit, oldest points will be removed when exceeded (default: Infinity)
//      .setSegments( number )                      change the wire's segment count (default: 7)
//      .setMaterials( materials )                  add material(s) to the mesh, removes existing (...Asset.Material, any number of arguments)
//      .enableNormals( bool )                      enable/disable normals (default: true)
//      .enableUVs( bool )                          enable/disable UVs (default: true)
//      .enableRadiusAttribute( bool )              enable/disable custom radius vertex attribute, useful for vertex shaders (default: false)
//      .enableColorAttribute( bool )               enable/disable color attribute (default: false)
//      .enablePreview( bool )                      enable/disable previewing the newest point when not yet added to wire (default: true)
//      .enableEndCaps( bool )                      enable/disable end caps on the mesh (default: false)
//      .enableEndCapsOutwardNormals( bool )        enable/disable outward normals on the end caps, useful for vertex shaders (default: false)
//      .enable2SegmentsOutwardNormals( bool )      enable/disable outward normals when the segment count is 2, useful for vertex shaders (default: false)
//      .enableEdgeLoop( bool )                     enable/disable an extra edge loop (when segments > 2 and UVs are enabled), making the UV.x attribute wrap instantly from 1 back to 0 (default: true)
//      .enableCurvedSubdivisions( bool )           enable/disable smoothing on subdivisions if subdivide > 0 (default: true)
//      .radius                                     mesh radius for newly added points (default: 5cm)
//      .stepDistance                               minimum distance before creating a new point
//      .subdivide                                  subdivide given path points (applied before stepDistance filtering!), handy for higher resolution vertex shader shaders (default: 0)
//
//
//      -> utility
//      .getLocalPoints()                           returns all wire positions in local space (previewing point excluded) (vec3 array)
//      .localToWorld( position )                   convert local position on this wire to a world position (vec3)
//      .getPreviewPoint()                          returns preview position, if any (vec3)
//      .getPointLimit()                            returns current point limit (int)
//      .getLengthLimit()                           returns current length limit
//      .getSegments()                              returns segment count (int)
//      .getMaterials()                             returns materials (Asset.Material array)
//      .getLength()                                returns total wire length, including preview
//      .getPartLength()                            returns the length of the currently rendered part of the wire, including preview
//      .getClosestPoint( position )                returns nearest interpolated point on the wire to a world position (returns an object containing: { position:vec3 (world), direction:vec3 (world), color:vec4, radius:number })
//      .getSceneObject()                           returns the generated SceneObject
//      .getRenderMeshVisual()                      returns the generated Component.RenderMeshVisual containing this wire's mesh asset
//      .getRenderMesh()                            returns the generated Asset.RenderMesh
//      .getBuilder()                               returns the generated MeshBuilder
//      .destroy( delay )                           destroys this wire and its SceneObject, optional delay argument (s)
//      WireTool.clear()                            clear all existing wires
//
//
//      -> debugging
//      .rebuildMesh()                              force rebuild mesh
//
//
//
// Tips & tricks
// 
//      -> It is recommended to keep the 'stepDistance' value as large as possible if wires are drawn on runtime, as this will prevent too much geometry being generated.
//          If you instead want the wire to always accept every point you give it, set 'stepDistance' to 0.
//
//      -> Disabling settings that are unnecessary for your use case (e.g. UVs, normals, previewing, end caps, etc.) is a small performance improvement that could be worth it if you're generating many wires simultaneously.
//
//      -> It is best to enable/disable settings before adding any points, as the existing geometry will be re-drawn which is not ideal for performance if there already are lots of points.
//
//      -> The UV.y coordinate on the mesh is its distance along the wire. You can remap this in a shader to get a length attribute along the wire!
//          Here is a quick Code Node one-liner where 'wireLength' is retrieved with 'getLength()', and 'range' is a custom value:
//          > float alongLine = system.remap(system.getSurfaceUVCoord0().y, wireLength, wireLength - range, 0., 1.);
//
//      -> The UVs of the start/end caps are planar projected, and their x and y values are in different ranges so they can be separated from the rest of the mesh in shader!
//          > UV.x is [1, 2] for the starting cap and [2, 3] for the end cap
//          > UV.y is in range [wireLength, wireLength + 1], so shaders using the wire length for vertex displacement will still look right
//
//      -> To use the custom 'radius' attribute in shaders, enable it using 'enableRadiusAttribute(true)' and then use the 'Custom Vertex Attribute' node set to 'radius' (float).
//          The radius is given in local space.
//          If you want to use a constant radius along the full wire, it is better for performance to simply use a static value in the shader instead.









// UI
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>WireTool 🧶</b> <small>by Max van Leeuwen</small>"}
//@ui {"widget":"label", "label":"Create 3D lines from points!"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"See top of this script for documentation!"}
//@ui {"widget":"label", "label":"<small><a href=\"https://www.maxvanleeuwen.com/wiretool\">maxvanleeuwen.com/wiretool</a>"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Usage"}
    //@ui {"widget":"label", "label":"<small>creating an instance"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>new WireTool.Create()"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>drawing"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.addPoints(</font>...vec3 </font> or ...</font><font color='#f5e3d5'>Points Object</font><font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.replace(</font>...vec3 </font> or ...</font><font color='#f5e3d5'>Points Object</font><font color='#56b1fc'>)"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>callbacks - bind using <font color='#56b1fc'><i>.add(</font><i>f<font color='#56b1fc'>)</i></font> and <font color='#56b1fc'><i>.remove(</font><i>f<font color='#56b1fc'>)</i></font>"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPointsAdded</font> → (<font color='#f5e3d5'>Pos</font>, <font color='#f5e3d5'>Dist</font>, <font color='#f5e3d5'>Color</font>, <font color='#f5e3d5'>Radius</font>)"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>customization"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.setPointLimit(</font>number<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.setLengthLimit(</font>number (local)<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.setSegments(</font>integer<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.setMaterials(</font>...Asset.Material<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableNormals(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableUVs(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableRadiusAttribute(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableColorAttribute(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enablePreview(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableEndCaps(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableEndCapsOutwardNormals(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enable2SegmentsOutwardNormals(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableEdgeLoop(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.enableCurvedSubdivisions(</font>bool<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.radius </font>= <font color='#f5e3d5'>Radius"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.stepDistance </font>= <font color='#f5e3d5'>Dist"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.subdivide </font>= int"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>utility"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getLocalPoints() </font>→ [<font color='#f5e3d5'>Pos</font>]"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.localToWorld(</font><font color='#f5e3d5'>Pos</font><font color='#56b1fc'>) </font>→ position (world)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPreviewPoint() </font>→ <font color='#f5e3d5'>Pos"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPointLimit() </font>→ int"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getLengthLimit() </font>→ <font color='#f5e3d5'>Dist"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getSegments() </font>→ int"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getMaterials() </font>→ [Asset.Material]"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getLength() </font>→ <font color='#f5e3d5'>Dist"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPartLength() </font>→ <font color='#f5e3d5'>Dist"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getClosestPoint(</font>position<font color='#56b1fc'>) </font>→ position (world)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getSceneObject() </font>→ SceneObject"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getRenderMeshVisual() </font>→ RenderMeshVisual"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getRenderMesh() </font>→ RenderMesh"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getBuilder() </font>→ MeshBuilder"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.destroy(</font>*delay<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <small>Clear all wires using <font color='#56b1fc'>WireTool.clear()"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>debugging"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.rebuildMesh()"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Data Types"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Points Object</font>: {<font color='#f5e3d5'>Pos</font>, *direction, <font color='#f5e3d5'>*Color</font>, <font color='#f5e3d5'>*Radius</font>}"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Pos</font>: position, vec3 (local)"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Dist</font>: distance (local)"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Color</font>: vec4"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Radius</font>: distance (local)"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Simple Example"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>var wire = new WireTool.Create() <font color='#4cad50'>// make wire"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>wire.onPointsAdded.add(function(points){"}
    //@ui {"widget":"label", "label":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small><font color='#ffd059'>print(points) <font color='#4cad50'>// print each Point Object on add"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>})"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>wire.addPoints(p1, p2) <font color='#4cad50'>// make line (p1, p2 = vec3)"}
//@ui {"widget":"group_end"}

// debugging
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}
//@input bool enableDebugging
//@ui {"widget":"group_start", "label":"🤓 Debugging Options", "showIf":"enableDebugging"}
    //@input bool renderLineStrip
    //@ui {"widget":"label", "label":"<font color='orange'><small>(When End Caps are enabled, an additional line is visible looping back from end to start)", "showIf":"renderLineStrip"}
//@ui {"widget":"group_end"}
//@ui {"widget":"label"}

// override debugging if overall disabled
if(!script.enableDebugging){
    script.renderLineStrip = false;
}



// stored
const title = '[WireTool]';
var wires = [];

// access
global.WireTool = script;
script.Create = Create;
script.clear = clear;



// create a new wire instance
function Create(){
    var self = this;



    // - public

    /**
	 * @description append points to this wire (...vec3/objects, any number of arguments) */
	this.addPoints = addPoints;

    /**
	 * @description clear and add new points (...vec3/objects, any number of arguments) */
	this.replace = replace;



    /**
	 * @description event: on new points added to wire (and passed the stepDistance filter) */
	this.onPointsAdded = makeSignal();



    /**
     * @description set a point limit, oldest points will be removed when exceeded (int, default: 500) */
    this.setPointLimit = setPointLimit;

    /**
     * @description set a length limit, oldest points will be removed when exceeded (default: Infinity) */
    this.setLengthLimit = setLengthLimit;

    /**
	 * @description change the wire's segment count (default: 7) */
	this.setSegments = setSegments;

    /**
	 * @description add material(s) to the mesh, removes existing (...Asset.Material, any number of arguments) */
	this.setMaterials = setMaterials;

    /**
	 * @description enable/disable normals (default: true) */
    this.enableNormals = enableNormals;

    /**
	 * @description enable/disable UVs (default: true) */
	this.enableUVs = enableUVs;

    /**
	 * @description enable/disable custom radius vertex attribute, useful for vertex shaders (default: false) */
    this.enableRadiusAttribute = enableRadiusAttribute;

    /**
	 * @description enable/disable color attribute (default: false) */
    this.enableColorAttribute = enableColorAttribute;

    /**
	 * @description enable/disable previewing the newest point when not yet added to wire (default: true) */
    this.enablePreview = enablePreview;

    /**
	 * @description enable/disable end caps on the mesh (default: false) */
    this.enableEndCaps = enableEndCaps;

    /**
	 * @description enable/disable outward normals on the end caps, useful for vertex shaders (default: false) */
    this.enableEndCapsOutwardNormals = enableEndCapsOutwardNormals;

    /**
	 * @description enable/disable outward normals when the segment count is 2, useful for vertex shaders (default: false) */
    this.enable2SegmentsOutwardNormals = enable2SegmentsOutwardNormals;

    /**
	 * @description enable/disable an extra edge loop (when segments > 2), making the UV.x attribute wrap instantly from 1 back to 0 (default: true) */
    this.enableEdgeLoop = enableEdgeLoop;

    /**
	 * @description enable/disable smoothing on subdivisions if subdivide > 0 (default: true) */
    this.enableCurvedSubdivisions = enableCurvedSubdivisions;

    /**
     * @type {Number}
	 * @description mesh radius for newly added points (default: 5cm) */
	this.radius = 5;

    /**
     * @type {Number}
	 * @description minimum distance before creating a new point */
	this.stepDistance = 1;

    /**
     * @type {Number}
	 * @description subdivide given path points (applied before stepDistance filtering!), handy for higher resolution vertex shader shaders (default: 0) */
	this.subdivide = 0;



    /**
	 * @description returns all wire positions in local space (previewing point excluded) (vec3 array) */
	this.getLocalPoints = () => pathPositions;

    /**
	 * @description convert local position on this wire to a world position (vec3) */
	this.localToWorld = localToWorld;

    /**
	 * @description returns preview position, if any (vec3) */
	this.getPreviewPoint = () => newPreview.nextPoint || null;

    /**
	 * @description returns current point limit (int) */
    this.getPointLimit = () => pointLimit;

    /**
	 * @description returns current length limit */
    this.getLengthLimit = () => lengthLimit;

    /**
	 * @description returns segment count (int) */
	this.getSegments = () => segments;

    /**
	 * @description returns materials (Asset.Material array) */
	this.getMaterials = () => materials;

    /**
	 * @description returns total wire length, including preview */
	this.getLength = () => newPreview.dist || wireLength;

    /**
	 * @description returns the length of the currently rendered part of the wire, including preview */
	this.getPartLength = () => (wireLength-pathDistances[0]) + (newPreview.dist ? newPreview.dist - wireLength : 0);

    /**
	 * @description returns nearest interpolated point on the wire to a world position (returns an object containing: { position:vec3 (world), direction:vec3 (world), color:vec4, radius:number }) */
	this.getClosestPoint = getClosestPoint;

    /**
	 * @description returns the generated SceneObject */
	this.getSceneObject = () => obj;

    /**
	 * @description returns the generated Component.RenderMeshVisual containing this wire's mesh asset */
	this.getRenderMeshVisual = () => rmv;

    /**
	 * @description returns the generated Asset.RenderMesh */
	this.getRenderMesh = () => builder.getMesh();

    /**
	 * @description returns the generated MeshBuilder */
	this.getBuilder = () => builder;

    /**
	 * @description destroys this wire and its SceneObject, optional delay argument (s) */
	this.destroy = destroy;



    /**
	 * @description force rebuild mesh */
	this.rebuildMesh = rebuildMesh;



    // - private



    // mesh settings
    var pointLimit = 500;
    var lengthLimit = Infinity;
    var segments = 7;
    var normalsEnabled = true;
    var uvsEnabled = true;
    var radiusAttributeEnabled = false;
    var colorsEnabled = false;
    var previewEnabled = true;
    var endCapsEnabled = false;
    var endCapsOutwardNormalsEnabled = false;
    var s2o = false;
    var edgeloopEnabled = true;
    var curvedSubdivisions = true;
    const defaultColor = vec4.zero();


    // placeholders
    var obj; // sceneobject
    var trf; // Transform
    var rmv; // render mesh visual
    var builder; // meshbuilder
    var materials; // all materials currently on rmv
    
    var meshAttributes; // all attributes to be stored on the mesh
    var uvxIndex;
    var attributeCount = 0; // attribute data count

    var pathPositions = []; // all vec3 points on wire path
    var pathDistances = []; // all unit distances per point of pathPositions
    var pathColors = []; // all vec4 point colors attributes
    var pathRadii = []; // all path radii
    var pathDirections = []; // all path directions
    var wireLength = 0; // total wire length
    var prvWireLength = 0; // keeping track of wireLength difference

    var edgeloop; // most recent segments count for this mesh
    var edgeloopSegments; // current edge loop count

    var firstRingRendered; // bool flag if this mesh's first real (non-previewing) mesh has been rendered
    var endcapsRing; // the last drawn ring vertices interleaved, stored so that end caps can use it
    var existingPreview; // if a preview was made on the previous draw call, its data will be stored here
    var existingEndCaps; // if endcaps were made on the previous draw call, its data will be stored here
    var prvPathVector; // last pathVector for smoothing when previewing
    var angleStep = (Math.PI * 2) / segments; // keeping this here so it doesn't have to be recalculated inside of makeRings for each new path point

    var newPreview = {}; // upcoming preview data



    // initialize
    function init(){
        // sceneobject
        obj = global.scene.createSceneObject("Wire"); //("Wire " + wires.length.toString()); // 'Wire 0', 'Wire 1', etc
        wires.push(self); // register
        trf = obj.getTransform();
        rmv = obj.createComponent("Component.RenderMeshVisual");
        setMaterials();

        // meshbuilder
        initializeMeshBuilder();
    }



    // meshbuilder might need to be re-initialized if attributes change
    function initializeMeshBuilder(){
        // create attributes
        meshAttributes = [
            {name: "position", components: 3},
            ...normalsEnabled ? [{name: "normal", components: 3}] : [],
            ...uvsEnabled ? [{name: "texture0", components: 2}] : [],
            ...radiusAttributeEnabled ? [{name: "radius", components: 1}] : [],
            ...colorsEnabled ? [{name: "color", components: 4}] : [],
        ];
        uvxIndex = normalsEnabled ? 6 : 3; // match index with texture0.x

        // count flat attributes
        attributeCount = 0;
        for(var i = 0; i < meshAttributes.length; i++){
            attributeCount += meshAttributes[i].components;
        }
        
        // builder
        builder = new MeshBuilder(meshAttributes);
        builder.topology = script.renderLineStrip ? MeshTopology.LineStrip : MeshTopology.Triangles;
        builder.indexType = MeshIndexType.UInt16;

        // rmv
        const mesh = builder.getMesh();
        rmv.mesh = mesh;
    }



    // add path points to wire
    function addPoints(...p){
        if(p.length == 0 && p.x == null) return;

        // point objects
        if(p[0].position != null){ // point object always has a 'position' property
            const positions = [];
            const colors = [];
            const radii = [];
            const directions = [];

            // prepare arrays
            p.forEach(item => {
                positions.push(item.position);
                radii.push('radius' in item ? item.radius : self.radius); // pick custom attribute values, use defaults if none
                colors.push('color' in item ? item.color : defaultColor);
                directions.push('direction' in item ? item.direction : null); // direction attribute null means yet to be calculated
            });
            filterAndPreparePoints(positions, colors, radii, directions);

        }else if(p[0].x != null){ // check for vec3
            filterAndPreparePoints(p, [defaultColor], [self.radius], [null]); // if attribute array lengths are shorter than p, the 1st item will be picked every time (attribute defauls)
        }
    }



    // clear existing and add new points
    function replace(...p){
        resetMesh();
        if(p.length > 0) addPoints(...p);
    }



    // filter and append positions to wire, arrays should be of same length as p otherwise index 0 will be picked as default attribute value
    function filterAndPreparePoints(p, c, r, d){
        var prvStep = pathPositions[pathPositions.length-1]; // get last point of previous batch (null if first batch)
        prvWireLength = wireLength; // get wire length before adding any new points


        // all points with their custom or default data to append to the wire
        var preparedPoints = [];
        function preparePoint(position, distance, attrIndex, subdivideColor){
            if(distance) wireLength += distance; // increase wireLength

            // get attributes
            const color = subdivideColor || nullish(c[attrIndex], c[0]); // color might be interpolated in subdivisions, in which case this new color overrules
            const radius = nullish(r[attrIndex], r[0]);
            const direction = nullish(d[attrIndex], d[0]);

            // append
            var thisPoint = {position, distance:wireLength, color, radius, direction}; // create per-point data to later go through one by one
            preparedPoints.push(thisPoint);
        }

        // reset newPreview on begin, keeping track of where it should go
        newPreview = {};
        function setNewPreview(position, distance, attrIndex){
            // directly save to var (overwrite)
            newPreview.nextPoint = position;
            newPreview.dist = distance;

            // get and set attributes
            newPreview.color = nullish(c[attrIndex], c[0]);
            newPreview.radius = nullish(r[attrIndex], r[0]);
            newPreview.direction = nullish(d[attrIndex], d[0]);
        }

        
        // create path points (distance threshold filtered)
        if(self.subdivide == 0){ // no subdivisions required
            for(var i = 0; i < p.length; i++){
                const basePoint = worldToLocal(p[i]);
                if(prvStep == null){ // first point of first batch is added as-is
                    preparePoint(basePoint, null, i);
                    prvStep = basePoint;
                    continue;
                }
                const dist = prvStep.distance(basePoint);

                if(dist > self.stepDistance){ // distance check
                    // reset preview if good point found
                    newPreview = {};
                    preparePoint(basePoint, dist, i);
                    prvStep = basePoint; // update previous for distance check
                }else{
                    setNewPreview(basePoint, wireLength + dist, i);
                }
            }

        }else{ // if subdivisions need to be inserted
            const prvStepStatic = prvStep; // prvStep unchanged
            const prv2StepStatic = pathPositions[pathPositions.length-2]; // get the point before the last point, unchanged
            const prvColor = pathColors[pathColors.length-1]; // get the color of the point before this one
            
            for(var i = 0; i < p.length; i++){ // for each point, insert subdivisions
                const basePoint = worldToLocal(p[i]); // from world space, to make it align even if the wire's sceneobject is parented to another object
                if(prvStep == null){ // first point of first batch is added as-is
                    preparePoint(basePoint, null, i);
                    prvStep = basePoint;
                    continue;
                }

                // get point that came before this one
                let prvPoint = p[i-1] || prvStep;
                
                // insert points between previous and current
                const subdivisionPoints = self.subdivide == 0 ? 0 : self.subdivide+1;
                for(var j = 0; j < subdivisionPoints; j++){
                    const ratio = (j+1)/subdivisionPoints; // 0-1 ratio, exclusive start and inclusive end (e.g. subdivide=3 makes [.25, .5, .75, 1])
                
                    var subdivisionPoint;
                    if(curvedSubdivisions && prv2StepStatic){
                        subdivisionPoint = quadraticBezier(prv2StepStatic, prvStepStatic, basePoint, ratio); // smoother subdivisions
                    }else{
                        subdivisionPoint = vec3.lerp(prvPoint, basePoint, ratio);
                    }
                    const dist = prvStep.distance(subdivisionPoint);

                    if(dist > self.stepDistance){
                        // reset preview if good point found
                        newPreview = {};
                        const thisColor = nullish(c[i], c[0]);
                        const subdivideColor = prvColor ? vec4.lerp(prvColor, thisColor, j/subdivisionPoints) : thisColor;
                        preparePoint(subdivisionPoint, dist, i, subdivideColor);
                        prvStep = subdivisionPoint; // update previous for distance check
                    }else{
                        setNewPreview(basePoint, wireLength + dist, i);
                    }
                }
            }
        }

        drawCall(preparedPoints);
    }


    
    // mesh draw call
    function drawCall(points){
        // get the required edge loop count for this mesh
        edgeloop = (uvsEnabled || edgeloopEnabled) && segments > 2 && uvsEnabled;
        edgeloopSegments = segments + edgeloop;
    
        // checks
        const doPath = points.length > 0;
        const doPreview = previewEnabled && (self.stepDistance > 0) && (newPreview.dist != null);
        const doEndCaps = endCapsEnabled; // update end caps on any geo change
    
        // edit mesh
        if(existingEndCaps) removeEndCaps(); // remove end caps
        if(existingPreview) removePreview(); // remove old mesh preview
        if(doPath) addPointsToMesh(points); // send new points to mesh
        if(doPreview) appendPreview(); // append preview to mesh
        if(doEndCaps) appendEndCaps(); // add end caps

        // update generated mesh
        builder.updateMesh();

        // user callback
        self.onPointsAdded.callback(points);
    }



    // returns closest point with interpolated data on wire
    function getClosestPoint(p){
        if(pathPositions.length == 1) return {position:localToWorld(pathPositions[0]), direction:localDirToWorldDir(pathDirections[0]), color:pathColors[0], radius:pathRadii[0], ratio:.5};
        
        // make local
        p = worldToLocal(p);

        // get closest point on line to p
        var closest = {
            dist : Infinity,
            i : null,
        }
        for(var i = 0; i < pathPositions.length; i++){
            const pathP = pathPositions[i];
            const dist = pathP.distance(p);
            if(dist < closest.dist){
                closest.dist = dist;
                closest.i = i;
            }
        }

        // check which point on the line is closer, the one before or after the closest point
        var closestI = closest.i;
        const prvIDist = closestI > 0 ? pathPositions[closestI-1].distance(p) : Infinity;
        const nxtIDist = closestI < pathPositions.length-1 ? pathPositions[closestI+1].distance(p) : Infinity;
        var otherI = prvIDist < nxtIDist ? closestI-1 : closestI+1;
        if(closestI > otherI){ // swap, closestI mut be lowest index
            const tmp = closestI;
            closestI = otherI;
            otherI = tmp;
        }

        // get point on line
        var p1 = pathPositions[closestI];
        var p2 = pathPositions[otherI];
        if(!p1 || !p2) return; // no points found
        const lineVec = p2.sub(p1);
        const pointVec = p.sub(p1);
        const lineLengthSquared = lineVec.dot(lineVec);
        const t = pointVec.dot(lineVec) / lineLengthSquared; // project pointVec onto lineVec
        const clampedT = Math.max(0, Math.min(1, t));
        const closestPoint = p1.add(lineVec.uniformScale(clampedT));
        
        // interpolate attributes
        const position = localToWorld(closestPoint); // world space
        const direction = localDirToWorldDir( interpolate(pathDirections[closestI], pathDirections[otherI], clampedT) ); // world space
        const color = interpolate(pathColors[closestI], pathColors[otherI], clampedT);
        const radius = interpolate(pathRadii[closestI], pathRadii[otherI], clampedT);
        const ratio = clampedT;
        return {position, direction, color, radius, ratio}; // make world position and direction 
    }

    // set point limit
    function setPointLimit(n){
        n = Math.round(n);
        if(n < 2){
            print(`${title} Invalid point limit (${n}), must be greater than 1! Keeping original value: ${pointLimit}`);
            return;
        }
        pointLimit = n;
        rebuildMesh();
    }

    // set length limit
    function setLengthLimit(n){
        if(n <= 0){
            print(`${title} Invalid length limit (${n}), must be greater than 0! Keeping original value: ${lengthLimit}`);
            return;
        }
        lengthLimit = n;
        rebuildMesh();
    }

    // rebuild with new segment count
    function setSegments(n){
        n = Math.round(n);
        if(n == segments) return;
        if(n < 2){
            print(`${title} Invalid segments (${n}), must be greater than 1! Keeping original value: ${segments}`);
            return;
        }
        if(n == 2 && endCapsEnabled){
            print(`${title} Invalid segments (${n}) for end caps, mesh must be a closed tube! End caps will be disabled.`);
            enableEndCaps(false);
        }
        segments = n;
        angleStep = (Math.PI * 2) / segments; // update angleStep for makeRings
        rebuildMesh();
    }

    // set normals
    function enableNormals(v){
        if(v == normalsEnabled) return;
        normalsEnabled = v;
        rebuildMesh();
    }

    // set UVs
    function enableUVs(v){
        if(v == uvsEnabled) return;
        uvsEnabled = v;
        rebuildMesh();
    }

    // set radius attribute
    function enableRadiusAttribute(v){
        if(v == radiusAttributeEnabled) return;
        radiusAttributeEnabled = v;
        rebuildMesh();
    }

    // set color attribute
    function enableColorAttribute(v){
        if(v == colorsEnabled) return;
        colorsEnabled = v;
        rebuildMesh();
    }

    // set preview
    function enablePreview(v){
        if(v == previewEnabled) return;
        previewEnabled = v;
        firstRingRendered = null;
        endcapsRing = null;
        rebuildMesh();
    }

    // set end caps
    function enableEndCaps(v){
        if(v == endCapsEnabled) return;
        if(segments == 2 && v){
            print(`${title} Invalid segments (${segments}) for end caps, mesh must be a closed tube! End caps were not enabled.`);
            return;
        }
        endCapsEnabled = v;
        endcapsRing = null;
        rebuildMesh();
    }

    // set end cap normals to be outwards
    function enableEndCapsOutwardNormals(v){
        if(v == endCapsOutwardNormalsEnabled) return;
        endCapsOutwardNormalsEnabled = v;
        rebuildMesh();
    }

    // set 2-segment normals to be outwards
    function enable2SegmentsOutwardNormals(v){
        if(v == s2o) return;
        s2o = v;
        rebuildMesh();
    }

    // set edge loop
    function enableEdgeLoop(v){
        if(v == edgeloopEnabled) return;
        edgeloopEnabled = v;
        rebuildMesh();
    }

    // set smoother subdivisions
    function enableCurvedSubdivisions(v){
        if(v == curvedSubdivisions) return;
        curvedSubdivisions = v;
        rebuildMesh();
    }



    // convert local point to world point and other way around, in case of SceneObject being parented
    function localToWorld(p){
        if(isNull(trf) || !p) return;
        return trf.getWorldTransform().multiplyPoint(p);
    }
    function worldToLocal(p){
        if(isNull(trf) || !p) return;
        return trf.getInvertedWorldTransform().multiplyPoint(p);
    }
    function localDirToWorldDir(v){
        if(isNull(trf) || !v) return;
        return trf.getWorldTransform().multiplyDirection(v);
    }


    
    // previous data for rotation consistency
    var prvVec;
    var prvNormal;
    var prvBiNormal;
    // creates a flat array of 1 or 2 rings, following the line. if segments==2 it also outputs the up vectors, for use in normals later
    function makeRings(positions, vectors, radii, updatePrvVec, isEndCap){
        const rings = [];
        const upVecs = [];

        for(var i = 0; i < positions.length; i++){ // there is usually only 1 position, at the start of the wire there are 2
            const p = positions[i];
            const thisVec = vectors[i] || vectors[0]; // there might only be 1 vector, in that case use it for both rings


            // rotate prv normal and binormal along with new vector (if previous data exists, otherwise invent a normal direction)
            var normal;
            var biNormal;
            if(!isEndCap && prvVec){
                const fromTo = quat.rotationFromTo(prvVec, thisVec); // quat difference to new point
                normal = fromTo.multiplyVec3(prvNormal);
                biNormal = fromTo.multiplyVec3(prvBiNormal);

            }else{
                const refDot = Math.abs(thisVec.dot(vec3.forward())); // 0-1 value where values nearing 1 create twists
                const remapped = Math.pow(refDot, 5); // neglect 'low' values (only relevant when nearing 1)
                const fwdVec = vec3.slerp(vec3.forward(), vec3.right(), remapped); // use remapped as ratio for slerp
                
                normal = thisVec.cross(fwdVec).normalize(); // default to forward vector for cross product
                if(isNaN(normal.x)) normal = thisVec.cross(vec3.up()).normalize(); // fallback to up vector if cross product fails
                biNormal = thisVec.cross(normal).normalize();
            }


            // update the prv data
            if(updatePrvVec){
                prvVec = thisVec;
                prvNormal = normal;
                prvBiNormal = biNormal;
            }

            // make points on ring
            for(let j = 0; j < segments; j++){
                const angle = angleStep * j; // angle on circle
                let rotatedVector = rotateVectorAroundAxis(normal, angle, biNormal); // rotated vector around the direction
                rings.push(new vec3(
                    p.x + rotatedVector.x * radii[i],
                    p.y + rotatedVector.y * radii[i],
                    p.z + rotatedVector.z * radii[i]
                ));
            }


            // pushing the normalized direction vector as up-vector, only relevant when segments==2
            if(segments == 2){
                const upVec = rotateVectorAroundAxis(normal, angleStep*.5, biNormal);
                upVecs.push(upVec);
            }
        }
        return {positions:rings, upVecs};
    }



    // clear all histories and reset mesh
    function resetMesh(){
        // clear histories
        pathPositions = [];
        pathDistances = [];
        pathColors = [];
        pathRadii = [];
        pathDirections = [];

        // clear other appended mesh data
        existingEndCaps = null;
        existingPreview = null;
        wireLength = 0;
        prvWireLength = 0;
        
        // reset MeshBuilder
        if(!builder) return;
        if(builder.getVerticesCount() > 0) builder.eraseVertices(0, builder.getVerticesCount());
        if(builder.getIndicesCount() > 0) builder.eraseIndices(0, builder.getIndicesCount());
        builder.updateMesh();
    }



    // re-generate the mesh based on the stored path points, useful when attributes or vertex resolutions have changed
    function rebuildMesh(){
        // remember history before clearing
        const storedPathPositions = [...pathPositions];
        const storedPathDistances = [...pathDistances];
        const storedPathColors = [...pathColors];
        const storedPathRadii = [...pathRadii];
        const storedPathDirections = [...pathDirections];

        // remove old mesh
        resetMesh();
        
        // initialize a new meshbuilder, in case attributes or settings have changed
        initializeMeshBuilder();
        
        // restore wireLength if one was in the path history
        const restoredWireLength = storedPathDistances[storedPathDistances.length-1];
        if(restoredWireLength) wireLength = restoredWireLength;
        
        // rebuild mesh
        const points = createPoints(storedPathPositions, storedPathDistances, storedPathColors, storedPathRadii, storedPathDirections);
        if(points.length > 0) drawCall(points, pathPositions);
    }



    // convert history arrays to individual points
    function createPoints(positions, distances, colors, radii, directions){
        const points = [];
        for(var i = 0; i < positions.length; i++){
            points.push({
                position : positions[i],
                distance : distances[i],
                color : colors[i],
                radius : radii[i],
                direction : directions[i]
            });
        }
        return points;
    }



    // mesh material(s)
    function setMaterials(...m){
        rmv.clearMaterials();
        for(var i = 0; i < m.length; i++){ // add all materials
            rmv.addMaterial(m[i]);
        }
        materials = [...m];
    }



    // destroy wire, optional delay argument (s)
    var delayEvent;
    function destroy(delay){
        function doDestroy(){
            resetMesh();
            if(obj) obj.destroy();
        }
        if(delay == null){
            doDestroy();
        }else{
            if(delayEvent) script.removeEvent(delayEvent); // remove existing delay if called again
            delayEvent = script.createEvent("DelayedCallbackEvent");
            delayEvent.bind(doDestroy);
            delayEvent.reset(delay);
        }
    }



    // add to the mesh, returns true if onPointsAdded event should be called
    function addPointsToMesh(points){
        for(var i = 0; i < points.length; i++){
            const newPosition = points[i].position;
            const newDistance = points[i].distance;
            const newColor = points[i].color;
            const newRadius = points[i].radius;
            const newDirection = points[i].direction;
            addPointToMesh(newPosition, newDistance, newColor, newRadius, newDirection);
        }
    }



    // add 1 point on the wire, which will result in a ring connected to the end of the existing mesh (this function will also take care of the initial tube consisting of 2 rings at the start, when firstGeoDraw==true)
    function addPointToMesh(newPathPosition, newPathDistance, newPathColor, newPathRadius, newPathDirection){
        const firstGeoDraw = builder.getVerticesCount() == 0; // no geometry has been created yet
        const startingPathPositionsLength = pathPositions.length; // amount of path points currently stored (either 0 or 1)

        // store point data history in case of rebuilding the mesh later
        pathPositions.push(newPathPosition);
        pathDistances.push(newPathDistance);
        pathColors.push(newPathColor);
        pathRadii.push(newPathRadius);
        pathDirections.push(newPathDirection); // might be null, in which case it is overwritten later but it's important to store it now so the data is not lost when pathPositions.length<2

        // there have to be at least 2 points to actually render anything (on the next point, this function will include this point to create 2 rings instead of 1)
        if(pathPositions.length < 2) return;
        

        // convert to arrays, so the first point can be appended if necessary (as it may not be rendered yet) (all mesh generation functions expect an array of either 1 or 2 points)
        var newPathPositions = [newPathPosition];
        var newPathDistances = [newPathDistance];
        var newPathColors = [newPathColor];
        var newPathRadii = [newPathRadius];
        
        if(firstGeoDraw){ // if drawing mesh for the first time
            newPathPositions.unshift(pathPositions[0]); // include previous point data too (assuming that pathPositions.length==2 at this point)
            newPathDistances.unshift(pathDistances[0]);
            newPathColors.unshift(pathColors[0]);
            newPathRadii.unshift(pathRadii[0]);
        }


        // when 1 ring is being drawn at a time (so any point after the initial 2 rings), use the position of the ring before it for the vector
        const prvPos = firstGeoDraw ? null : pathPositions[pathPositions.length-2]; // pathPositions.length-2 because this new point has been added to this same list just now and so it will already be at index length-1

        // create mesh
        const vector =      newPathDirection || makeVector(newPathPositions, prvPos);                                               // vector for this point (starting ring has same vector as 2nd ring), looking at the previous point
        const prvVector =   firstGeoDraw ? pathDirections[pathDirections.length-2] || vector : null;                                // the vector of the first ring, only relevant when drawing 2 rings
        const vectors =     firstGeoDraw ? [prvVector, vector] : [vector];                                                          // when drawing 2 rings, allow individual directions
        const rings =       makeRings(newPathPositions, vectors, newPathRadii, true);                                               // rings around each point (positions, and upVecs if segments==2)
        const normals =     normalsEnabled ? makeNormals(newPathPositions, rings.upVecs, rings.positions, segments, s2o) : [];      // point normals for smooth shading
        const coords =      uvsEnabled ? makeCoords(newPathPositions, segments, newPathDistances) : [];                             // texture0 attribute, x is revolve and y is length
        const radii =       radiusAttributeEnabled ? makeRadii(newPathPositions, segments, newPathRadii, self.radius) : [];         // radius attribute
        const colors =      colorsEnabled ? makeColors(newPathPositions, segments, newPathColors) : [];                             // color attribute
        var vertices =      makeVertices(rings.positions, normals, coords, radii, colors);                                          // create flat array for interleaved vertex data (contains 'old' vertices from previous ring still)

        // extra edge loop to create full UV.x wrap, and only if there are >2 segments (preventing z-fighting in flat cards when segments==2)
        if(edgeloop) vertices = insertDoubleEdgeloop(vertices, attributeCount, segments, uvxIndex); // insert a copy of the last point in each ring


        // append path direction to path history
        if(firstGeoDraw && pathDirections[pathDirections.length-2]==null) pathDirections[pathDirections.length-2] = prvVector; // overwrite 1st ring if there are 2, in case that value was null earlier
        if(!newPathDirection) pathDirections[pathDirections.length-1] = vector; // overwrite this ring's direction, if the current value was null


        // if previewing
        if(previewEnabled) prvPathVector = vector; // store vector for previewing purposes
        
        // for preview and end caps
        firstRingRendered = true;
        if(endCapsEnabled) endcapsRing = vertices.slice(-edgeloopSegments * attributeCount); // store the last ring's vertices

        // add remaining vertices for new ring(s)
        builder.appendVerticesInterleaved(vertices);


        // append indices
        var thisPointLimit = pointLimit;
        if(lengthLimit == Infinity){ // no length limit
            const pointsLeft = pointLimit - startingPathPositionsLength; // point count that can still be added within limits
            if(pointsLeft > 0){ // indices only need to be added if the line is not at its maximum length yet, after that they stay the same for all vertices
                const startIndex = Math.max(startingPathPositionsLength - 1, 0) * edgeloopSegments; // which index to start mesh indices on (one ring before current one)
                const pointCount = Math.max(Math.min(newPathPositions.length, pointsLeft), 2); // get the amount of points to create indices for, up to pointLimit (always 2 at least as it needs to connect between two rings)
                const indices = makeIndices(pointCount, edgeloopSegments, startIndex); // create triangles between rings, offset the indices
                builder.appendIndices(indices);
            }

        }else{ // length limit
            thisPointLimit = Math.min( getPointLimitByDistance(pathDistances, lengthLimit), pointLimit); // get amount of points allowed with this length, and consider pointLimit too

            // create new indices or remove old
            const expectedIndicesCount = (thisPointLimit-1) * edgeloopSegments * 6; // 2 triangles per quad, a quad per segment inbetween 2 rings
            const indicesCount = builder.getIndicesCount();
            if(expectedIndicesCount > indicesCount){ // append more indices
                const missingPoints = ((expectedIndicesCount-indicesCount)/edgeloopSegments)/6 + 1;
                const startingIndex = indicesCount/6;
                const indices = makeIndices(missingPoints, edgeloopSegments, startingIndex); // create triangles between rings, offset the indices
                builder.appendIndices(indices);
            }else if(expectedIndicesCount < indicesCount){ // remove redundant indices
                builder.eraseIndices(expectedIndicesCount, indicesCount);
            }
        }
        

        // delete old vertices when point limit exceeded
        if(pathPositions.length > thisPointLimit){
            const allowedVertexCount = thisPointLimit * edgeloopSegments;
            const verticesToDelete = builder.getVerticesCount() - allowedVertexCount;
            if(verticesToDelete > 0) builder.eraseVertices(0, verticesToDelete);

            // remove from histories
            const dataToDelete = pathPositions.length - thisPointLimit;
            pathPositions.splice(0, dataToDelete);
            pathDistances.splice(0, dataToDelete);
            pathColors.splice(0, dataToDelete);
            pathRadii.splice(0, dataToDelete);
            pathDirections.splice(0, dataToDelete);
        }
    }



    // add temporary preview mesh
    function appendPreview(){
        const nextPoint = newPreview.nextPoint;
        const dist = newPreview.dist;
        const radius = newPreview.radius;
        const color = newPreview.color;
        const direction = newPreview.direction;
        
        // this is the first ring of the mesh - temporarily render both ends of the tube in this case
        if(!firstRingRendered){
            const bothPositions = [pathPositions[pathPositions.length-1], nextPoint];
            const bothDistances = [wireLength, wireLength+dist];
            const bothRadii = [pathRadii[pathRadii.length-1], radius];
            const bothColors = [pathColors[pathColors.length-1], color];

            const vector =              direction || makeVector(bothPositions);
            const rings =               makeRings(bothPositions, [vector], bothRadii);
            const normals =             normalsEnabled ? makeNormals(bothPositions, rings.upVecs, rings.positions, segments, s2o) : [];
            const coords =              uvsEnabled ? makeCoords(bothPositions, segments, bothDistances) : [];
            const radii =               radiusAttributeEnabled ? makeRadii(bothPositions, segments, bothRadii, self.radius) : [];
            const colors =              colorsEnabled ? makeColors(bothPositions, segments, bothColors) : [];
            var vertices =              makeVertices(rings.positions, normals, coords, radii, colors);
            if(edgeloop) vertices =     insertDoubleEdgeloop(vertices, attributeCount, segments, uvxIndex);

            // add to builder
            builder.appendVerticesInterleaved(vertices);
            const indices = makeIndices(2, edgeloopSegments, 0);
            builder.appendIndices(indices);
            
            // store counts to easily delete this part of the mesh later
            existingPreview = {
                verticesCount : vertices.length/attributeCount,
                indicesCount : indices.length,
                vector : vector,
            }

            // store vertices of most recent ring for end caps
            if(endCapsEnabled) endcapsRing = vertices.slice(vertices.length/2);

        // first ring is rendered already, only create a temporary 2nd ring
        }else{
            const prvPos =              pathPositions[pathPositions.length-1];
            const onePosition =         [nextPoint];
            const oneDist =             [dist];
            const oneRadius =           [radius];
            const oneColor =            [color];

            // lerp the pathVector (there is only one at this stage) based on distance, it looks less jittery this way
            var vector =                direction || makeVector(onePosition, prvPos);
            if(previewEnabled && prvPathVector && self.stepDistance > 0) vector = vec3.lerp(prvPathVector, vector, (dist-wireLength)/self.stepDistance);

            const rings =               makeRings(onePosition, [vector], oneRadius);
            const normals =             normalsEnabled ? makeNormals(onePosition, rings.upVecs, rings.positions, segments, s2o) : [];
            const coords =              uvsEnabled ? makeCoords(onePosition, segments, oneDist) : [];
            const radii =               radiusAttributeEnabled ? makeRadii(onePosition, segments, oneRadius, self.radius) : [];
            const colors =              colorsEnabled ? makeColors(onePosition, segments, oneColor) : [];
            var vertices =              makeVertices(rings.positions, normals, coords, radii, colors);
            if(edgeloop) vertices =     insertDoubleEdgeloop(vertices, attributeCount, segments, uvxIndex);

            // add to builder
            builder.appendVerticesInterleaved(vertices);
            const startIndex = (pathPositions.length-1) * edgeloopSegments;
            const indices = makeIndices(2, edgeloopSegments, startIndex);
            builder.appendIndices(indices);
            
            // store counts to easily delete this part of the mesh later
            existingPreview = {
                verticesCount : vertices.length/attributeCount,
                indicesCount : indices.length,
                vector : vector,
            }

            // store vertices of most recent ring for end caps
            if(endCapsEnabled) endcapsRing = [...vertices];
        }
    }



    // remove temporary preview mesh
    function removePreview(){
        const verticesCount = builder.getVerticesCount();
        if(verticesCount > 0 && existingPreview.verticesCount > 0) builder.eraseVertices(verticesCount - existingPreview.verticesCount, verticesCount);
        
        const indicesCount = builder.getIndicesCount();
        if(indicesCount > 0 && existingPreview.indicesCount > 0) builder.eraseIndices(indicesCount - existingPreview.indicesCount, indicesCount);

        existingPreview = null;
    }



    // add end caps
    function appendEndCaps(){
        if(!endcapsRing){
            existingEndCaps = null;
            return;
        }

        // counts of vertices/indices to be deleted on next draw call
        var verticesCount = 0
        var indicesCount = 0;


        // end cap vertices
        function appendEndCap(){
            // get ring
            const vertices = endcapsRing;
            var normals;
            if(normalsEnabled && !endCapsOutwardNormalsEnabled) normals = pathDirections[pathDirections.length-1]; // for end cap, the normals are the same as pathDirections[-1]

            // override data
            for(var i = 0; i < edgeloopSegments; i++){
                if(uvsEnabled){ // override coordinates
                    const angleOnRing = ((i/segments) % 1) * Math.PI*2;
                    const _x = Math.cos(angleOnRing) / 2 + .5; // 0-1
                    const _y = Math.sin(angleOnRing) / 2 + .5;
                    vertices[(i * attributeCount) + uvxIndex] = _x + 2; // x range is (2, 3) for end cap
                    vertices[(i * attributeCount) + uvxIndex + 1] = _y + wireLength;
                }
                if(normals){ // override normals
                    vertices[(i * attributeCount) + 3] = normals.x;
                    vertices[(i * attributeCount) + 4] = normals.y;
                    vertices[(i * attributeCount) + 5] = normals.z;
                }
            }
            builder.appendVerticesInterleaved(vertices);
    

            // end cap indices
            const indices = [];
            var indexOffset = edgeloopSegments * (pathPositions.length + (existingPreview ? 1 : 0)); // get indices offset including active preview
            for(let i = 0; i < edgeloopSegments-2; i++){
                const p1 = indexOffset;
                const p2 = indexOffset + i+2;
                const p3 = indexOffset + i+1;
                indices.push(p1, p2, p3);
            }
            builder.appendIndices(indices);


            // count
            verticesCount += vertices.length;
            indicesCount += indices.length;
        }
        appendEndCap();



        // start cap vertices
        function appendStartCap(){
            // get ring
            const onePosition =         [pathPositions[0]];
            const oneRadius =           [pathRadii[0]];
            const oneColor =            [pathColors[0]];
            const oneVector =           pathDirections[0] || existingPreview.vector; // get preview direction if no path direction exists yet
            const rings =               makeRings(onePosition, [oneVector], oneRadius, false, true);
            const normals =             normalsEnabled ? (endCapsOutwardNormalsEnabled ? makeNormals(onePosition, rings.upVecs, rings.positions, segments) : new Array(segments).fill(oneVector.uniformScale(-1))) : []; // inverse of oneVector is a flat surface
            const coords =              uvsEnabled ? new Array(segments).fill(vec2.zero()) : []; // UVs will be overwritten later anyways
            const radii =               radiusAttributeEnabled ? makeRadii(onePosition, segments, oneRadius, self.radius) : [];
            const colors =              colorsEnabled ? makeColors(onePosition, segments, oneColor) : [];
            var vertices =              makeVertices(rings.positions, normals, coords, radii, colors);
            if(edgeloop) vertices =     insertDoubleEdgeloop(vertices, attributeCount, segments, uvxIndex);

            // override data
            for(var i = 0; i < edgeloopSegments; i++){
                if(uvsEnabled){ // override coordinates
                    const angleOnRing = ((i/segments) % 1) * Math.PI*2;
                    const _x = Math.cos(angleOnRing) / 2 + .5; // 0-1
                    const _y = Math.sin(angleOnRing) / 2 + .5;
                    vertices[(i * attributeCount) + uvxIndex] = _x + 1; // x range is (1, 2) for start cap
                    vertices[(i * attributeCount) + uvxIndex + 1] = _y;
                }
            }
            builder.appendVerticesInterleaved(vertices);


            // start cap indices
            let indices = [];
            var indexOffset = edgeloopSegments * ((pathPositions.length+1) + (existingPreview ? 1 : 0)); // get indices offset including active preview
            for(let i = 0; i < edgeloopSegments-2; i++){ // -2 because the two vertices on the sides of the starting vertex do not get to be the outer point of a triangle, for example: 10 vertices in a ring need only 8 triangles to make a circle
                const p1 = indexOffset;
                const p2 = indexOffset + i+2;
                const p3 = indexOffset + i+1;
                indices.push(p1, p2, p3);
            }
            builder.appendIndices(indices);

            
            // count
            verticesCount += vertices.length;
            indicesCount += indices.length;
        }
        appendStartCap();
        

        // register counts
        existingEndCaps = {
            verticesCount : verticesCount/attributeCount,
            indicesCount : indicesCount
        }
    }



    // remove end caps
    function removeEndCaps(){
        if(!existingEndCaps) return;

        const verticesCount = builder.getVerticesCount();
        if(verticesCount > 0 && existingEndCaps.verticesCount > 0) builder.eraseVertices(verticesCount - existingEndCaps.verticesCount, verticesCount);
        
        const indicesCount = builder.getIndicesCount();
        if(indicesCount > 0 && existingEndCaps.indicesCount > 0) builder.eraseIndices(indicesCount - existingEndCaps.indicesCount, indicesCount);

        existingEndCaps = null;
    }



    init();
}









// clear all existing wires
function clear(){
    for(var i = 0; i < wires.length; i++){
        wires[i].destroy();
    }
    wires = [];
}



// get look-at vector, if prvPoint is given it assumes points[0] to be next point
function makeVector(points, prvPoint){
    function makeVec(a, b){ // make a vector from a to b (normalized)
        if(!a) return;
        if(a.equal(b)) return vec3.up(); // save a vec3 from being NaN (edge case)
        return b.sub(a).normalize();
    }

    if(prvPoint) return makeVec(prvPoint, points[0]);
    return makeVec(points[0], points[1]); // create look-at from previous point to this point
}



// rotating vec3 around axis (k, normalized vec3) by angle (rad)
function rotateVectorAroundAxis(v, angle, crossProduct) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    return new vec3(
        v.x * cosAngle + crossProduct.x * sinAngle,
        v.y * cosAngle + crossProduct.y * sinAngle,
        v.z * cosAngle + crossProduct.z * sinAngle
    );
}



// returns an array of normals (vec3), corresponding with path points
function makeNormals(pathPoints, upVectors, rings, segments, s2o){
    const normals = [];

    for(let i = 0; i < pathPoints.length; i++){
        const p = pathPoints[i];
        
        for(let j = 0; j < segments; j++){
            if(segments==2 && !s2o){ // if segments==2, just do upwards normals relative to moving direction
                normals.push(upVectors[i]);
            }else{ // make outwards normals for closed tube meshes
                const ringIndex = i * segments + j;
                const ringP = rings[ringIndex];
                const normal = ringP.sub(p).normalize();
                normals.push(normal);
            }
        }
    }
    return normals;
}



// returns an array of coords (vec2) corresponding with path points
function makeCoords(pathPoints, segments, pathDistances){
    const isFlatPlane = segments == 2;
    const coords = [];
    for(var i = 0; i < pathPoints.length; i++){
        const distAlongPath = pathDistances[i];
        for(var j = 0; j < segments; j++){
            let coord = new vec2(
                isFlatPlane ? j/(segments-1) : j/segments, // revolving
                distAlongPath // length
            );
            coords.push(coord);
        }
    }
    return coords;
}



// returns an array of radius attributes (numbers) corresponding with path points
function makeRadii(pathPoints, segments, radii, defaultRadius){
    // fill start of radius array with default until the length is the same as pathPoints, if it isn't already
    while(radii.length < pathPoints.length) radii.unshift(defaultRadius);

    var radiusAttributes = [];
    for(var i = 0; i < pathPoints.length; i++){
        for(var j = 0; j < segments; j++){
            radiusAttributes.push(radii[i]);
        }
    }
    return radiusAttributes;
}




// returns an array of color attributes (vec4) corresponding with path points
function makeColors(pathPoints, segments, colors){
    // fill start of colors array with default until the length is the same as pathPoints, if it isn't already
    while(colors.length < pathPoints.length) colors.unshift(defaultColor);

    var colorAttributes = [];
    for(var i = 0; i < pathPoints.length; i++){
        for(var j = 0; j < segments; j++){
            colorAttributes.push(colors[i]);
        }
    }
    return colorAttributes;
}



// returns a flat array of indices that form the triangles between each ring in the tube
function makeIndices(ringsCount, segments, startingIndex){
    const indices = [];
    for(let ringIndex = 0; ringIndex < ringsCount - 1; ringIndex++){ // go through each ring index and connect to the next one
        for(let pointIndex = 0; pointIndex < segments; pointIndex++){ // make quads (2 triangles)
            const nextPointIndex = (pointIndex + 1) % segments;

            // get quad points
            const p1 = ringIndex * segments + pointIndex + startingIndex; // ring 1 left
            const p2 = ringIndex * segments + nextPointIndex + startingIndex; // ring 1 right
            const p3 = (ringIndex + 1) * segments + pointIndex + startingIndex; // ring 2 left
            const p4 = (ringIndex + 1) * segments + nextPointIndex + startingIndex; // ring 2 right
            indices.push(p1, p2, p3); // triangle 1
            indices.push(p2, p4, p3); // triangle 2
        }
    }
    return indices;
}



// returns an interleaved array of vertex data, containing number/vec2/vec3 data (make sure the length of each given array is the same! first arg's array length is used)
function makeVertices(...data){
    // create flat arrays of arguments converted to number arrays
    const dataAsNumberArrays = [];
    for(var i = 0; i < data.length; i++){
        if(typeof data[i][0] == 'undefined'){ // some data arguments can be empty arrays, these should be skipped
            dataAsNumberArrays.push([]);
        }else{
            dataAsNumberArrays.push(makeNumbersArray(data[i]));
        }
    }

    // add interleaved
    const vertices = [];
    for(var i = 0; i < dataAsNumberArrays[0].length; i++){
        for(var j = 0; j < dataAsNumberArrays.length; j++){
            const d = dataAsNumberArrays[j][i];
            
            // push data depending on if it is iterable
            const dataType = typeof d;
            if(dataType != 'undefined'){
                const isNumber = dataType == 'number';
                if(isNumber){
                    vertices.push(d);
                }else{
                    vertices.push(...d);
                }
            }
        }
    }
    return vertices;
}



// trim a line of points to a maximum length (based on corresponding distances array), returns allowed indices count from the end of the array to the start
function getPointLimitByDistance(distances, maxLength){
    // check if distances check is necessary
    const partLength = distances[distances.length-1]-distances[0];
    if(partLength < maxLength) return distances.length;

    var totalDistance = 0;
    for(var i = distances.length-1; i >= 0; i--){
        totalDistance += distances[i] - (distances[i-1] || 0); // get difference from this point to previous
        if(totalDistance >= maxLength) return distances.length-i;
    }
    return distances.length;
}



function getDataType(x){
    // check what the contents of this array are
    var dataType;
    if(typeof x.x == 'undefined'){
        dataType = 'number';
    }else if(typeof x.z == 'undefined'){
        dataType = 'vec2';
    }else if(typeof x.w == 'undefined'){
        dataType = 'vec3';
    }else{
        dataType = 'vec4';
    }
    return dataType;
}



// converts array of data type (number, vec2, vec3, vec4) to an array containing flat number arrays
function makeNumbersArray(x){
    const dataType = getDataType(x[0]);
    if(dataType == 'number') return x; // is number array already

    // create new flat array containing numbers only
    const arr = [];
    for(var i = 0; i < x.length; i++){
        const thisItem = x[i];
        if(dataType == 'vec2'){
            arr.push([thisItem.x, thisItem.y]);
        }else if(dataType == 'vec3'){
            arr.push([thisItem.x, thisItem.y, thisItem.z]);
        }else if(dataType == 'vec4'){
            arr.push([thisItem.x, thisItem.y, thisItem.z, thisItem.w]);
        }
    }
    return arr;
}



// copy the last point of each ring at the same position, so the UV.x can wrap back from 1 to 0 instantly instead of interpolating between indices
function insertDoubleEdgeloop(vertices, attributeCount, segments, uvxIndex){
    const vtxCount = vertices.length/attributeCount;
    let newVertices = [];

    var newVertex;
    for(let i = 0; i < vtxCount; i++){
        // add existing data to new array
        for(let j = 0; j < attributeCount; j++){
            newVertices.push(vertices[i * attributeCount + j]);
        }

        // create duplicate of first vertex
        if(i % segments === 0){
            newVertex = vertices.slice(i*attributeCount, (i+1)*attributeCount);
            newVertex[uvxIndex] = 1; // manually overwrite UV.x to be 1 instead of 0, this is so the UV wraps around instantly
        }

        // push into array at the end of each ring
        if(i % segments == segments-1) newVertices = newVertices.concat(newVertex);
    }

    // return vertices;
    return newVertices;
}



// returns value remapped from range low1-high1 to range low2-high2 (low2/high2 defaults are 0 and 1, clamped is false by default)
function remap(value, low1, high1, low2, high2, clamped){
	low2 = low2 == null ? 0 : low2;
	high2 = high2 == null ? 1 : high2;
	var remapped = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	return clamped ? clamp(remapped, low2, high2) : remapped;
}



// returns the clamped value between the low and high values (defaults are 0, 1)
function clamp(value, low, high){
	if(!low && low !== 0) low = 0;
	if(!high && high !== 0) high = 1;
	return Math.max(Math.min(value, Math.max(low, high)), Math.min(low, high));
}



// simple replacement for nullish coalescing operator ('??'), not available at this time
function nullish(a, b){
    return (a !== undefined && a !== null) ? a : b;
}



// interpolate two vec3 points with a nice curve (requires point that came before)
function quadraticBezier(pointBefore, startPoint, endPoint, t){
    // convert three sequential points into two points (p0, p2) and one handle (p1)
    const p0 = startPoint;
    const p1 = startPoint.add(startPoint.sub(pointBefore));
    const p2 = endPoint;

    // lerp into each other
    const p0p1 = vec3.lerp(p0, p1, t);
    const p1p2 = vec3.lerp(p1, p2, t);
    return vec3.lerp(p0p1, p1p2, t);
}



// makes a function into a signal that you can bind functions to
// bind using 'add' and 'remove', and use 'callback' to execute
// ex.  var signal = makeSignal()
//	    signal.add(someFunction)
// 	    signal.callback(...args)
//	    signal.remove(someFunction)
function makeSignal(){
	var callbacks = [];
	function add(f){
		callbacks.push(f);
	}
	function remove(f){
		for(let i = callbacks.length - 1; i >= 0; i--){
			if(callbacks[i] === f){
				callbacks.splice(i, 1);
			}
		}
	}
	function callback(...args){
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](...args);
		}
	}
	return {add, remove, callback};
}



// interpolate between two numbers, vec2, vec3, or vec4 (assumes a and b are the same type)
function interpolate(a, b, ratio){
    const dataType = getDataType(a);
    switch(dataType){
        case 'number':
            return a * (1-ratio) + (b*ratio);
        case 'vec2':
            return vec2.lerp(a, b, ratio);
        case 'vec3':
            return vec3.lerp(a, b, ratio);
        case 'vec4':
            return vec4.lerp(a, b, ratio);
    }
}