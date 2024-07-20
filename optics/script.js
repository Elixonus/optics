class Point {
    /** create a new point from x and y components */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }

    /** copy x and y components of existing point */
    clone() {
        return new Point(this.x, this.y);
    }

    /** check if all components of points match */
    isEqual(p) {
        return (this.x === p.x && this.y === p.y);
    }

    /** copy components of parameter point to current point */
    setTo(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }

    /** add components of parameter point to current point */
    addTo(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    /** add x component to current point */
    addToX(x) {
        this.x += x;
        return this;
    }

    /** add y component to current point */
    addToY(y) {
        this.y += y;
        return this;
    }

    /** add each individual x and y component to current point */
    addToXY(x, y) {
        return this.addToX(x).addToY(y);
    }

    /** add components of polar vector with radius and angle to current point */
    addToPolar(r, a) {
        this.x += r * Math.cos(a);
        this.y += r * Math.sin(a);
        return this;
    }

    /**  subtract components of parameter point from current point */
    subtractTo(p) {
        return this.addToXY(-p.x, -p.y);
    }

    /** subtract x component from current x */
    subtractToX(x) {
        return this.addToX(-x);
    }

    /** subtract y component from current y */
    subtractToY(y) {
        return this.addToY(-y);
    }

    /** subtract x and y components from current point */
    subtractToXY(x, y) {
        return this.subtractToX(x).subtractToY(y);
    }

    /** multiply current point components by factor */
    multiplyBy(x) {
        return this.scaleXY(x);
    }

    /** divide current point components by division factor */
    divideBy(x) {
        return this.scaleXY(1 / x);
    }

    /** multiply current point components by parameter point components */
    scale(p) {
        return this.scaleXY(p.x, p.y);
    }

    /** multiply current x component by x factor */
    scaleX(x) {
        this.x *= x;
        return this;
    }

    /** multiply current y component by y factor */
    scaleY(y) {
        this.y *= y;
        return this;
    }

    /** multiply current point components by x and y factor */
    scaleXY(x, y = x) {
        return this.scaleX(x).scaleY(y);
    }

    /**
     * rotate current point around parameter point by angle in radians
     * if angle is positive, rotate from x axis towards y axis otherwise from y axis towards x axis
     */
    rotateAroundPoint(p, rotation) {
        let cosine = Math.cos(rotation);
        let sine = Math.sin(rotation);
        let xD = this.x - p.x;
        let yD = this.y - p.y;
        this.x = cosine * xD - sine * yD + p.x;
        this.y = sine * xD + cosine * yD + p.y;
        return this;
    }

    /**
     * move current point to a point on the line between the current and parameter points
     * if interpolation factor is 0, use current point, if interpolation factor is 1, use parameter point
     */
    interpolateToPointLinear(p, t) {
        this.x = interpolateLinear(this.x, p.x, t);
        this.y = interpolateLinear(this.y, p.y, t);
        return this;
    }

    /** if interpolation factor is 0, use current point, if interpolation factor is 1, use parameter point */
    interpolateToPointQuadratic(p, t) {
        this.x = interpolateQuadratic(this.x, p.x, t);
        this.y = interpolateQuadratic(this.y, p.y, t);
        return this;
    }

    /** move current point to a point halfway between current and parameter points */
    midPointTo(p) {
        this.x = (this.x + p.x) / 2;
        this.y = (this.y + p.y) / 2;
        return this;
    }

    /** find how far current point is from the origin */
    getMagnitude() {
        return this.getDistanceTo();
    }

    /** find the distance from the current point to the parameter point */
    getDistanceTo(p = pointOrigin) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }

    /** check whether each component of the current point match the reference parameter point within a threshold */
    matchesWith(ref, epsilon) {
        return (numberMatches(this.x, ref.x, epsilon) && numberMatches(this.y, ref.y, epsilon));
    }
}

class Line {
    /** create a line from two point objects */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        return this;
    }

    /** create a line from a point object and angle towards next point on the line */
    static fromRay(center, angle) {
        return new Line(center, center.clone().addToPolar(1, angle));
    }

    /** create a line from a point object and slope towards next point on the line */
    static fromPointSlope(point, slope) {
        return new Line(point, point.addTo(new Point(1, slope)));
    }

    /** copy components of the two points on the line */
    clone() {
        return new Line(this.p1.clone(), this.p2.clone());
    }

    /** check if components of points of parameter line match components of points of current line */
    isEqual(l) {
        return (this.p1.isEqual(l.p1) && this.p2.isEqual(l.p2))
    }

    /** translate line by components of parameter point */
    addTo(p) {
        this.p1.addTo(p);
        this.p2.addTo(p);
        return this;
    }

    /** translate line by components of parameter point in the opposite direction */
    subtractTo(p) {
        this.p1.subtractTo(p);
        this.p2.subtractTo(p);
        return this;
    }

    /** rotate points on the line around parameter point by angle in radians */
    rotateAroundPoint(p, rotation) {
        this.p1.rotateAroundPoint(p, rotation);
        this.p2.rotateAroundPoint(p, rotation);
        return this;
    }

    /** find distance between points on the line */
    getLength() {
        return distance(this.p1, this.p2);
    }

    /** find angle from first point to second point on the line in radians */
    getAngle() {
        let differencePoint = this.p1.clone().subtractTo(this.p2);
        return Math.atan2(differencePoint.y, differencePoint.x);
    }

    /** find the dot product of current and parameter lines as vectors */
    getDotProductBetweenLine(l) {
        let vector1 = this.p1.clone().subtractTo(this.p2);
        let vector2 = l.p1.clone().subtractTo(l.p2);
        let scalarProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        return scalarProduct;
    }

    /** find the magnitude of cross product of current and parameter lines as vectors */
    getProjectionOfCrossProductBetweenLine(l) {
        let vector1 = this.p1.clone().subtractTo(this.p2);
        let vector2 = l.p1.clone().subtractTo(l.p2);
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }

    /** find the angle formed by the current and parameter lines if put next to each other */
    getAngleBetweenLine(l) {
        return Math.acos(this.getDotProductBetweenLine(l) / (this.getLength() * l.getLength()));
    }

    /** find the angle formed by the perpendiculars of the current and parameter lines if put next to each other */
    getAngleBetweenLinePerpendicular(l) {
        return Math.asin(this.getSineOfAngleBetweenLinePerpendicular(l));
    }

    /** find the sine of the angle formed by the perpendiculars of the current and parameter lines if put next to each other */
    getSineOfAngleBetweenLinePerpendicular(l) {
        return Math.abs(this.getDotProductBetweenLine(l)) / (this.getLength() * l.getLength());
    }

    /** find the angle of reflection given an incident ray with an angle of incidence hitting current reflecive line */
    getAbsoluteAngleReflected(angleOfIncidence) {
        return 2 * this.getAngle() - angleOfIncidence;
    }

    /** check whether each component of each point of current line matches parameter line within a threshold */
    matchesWith(ref, epsilon) {
        return (this.p1.matchesWith(ref.p1, epsilon) && this.p2.matchesWith(ref.p2, epsilon));
    }
}

class DraggableObject {
    /** create a generic draggable? object from a position vector point and rotation angle */
    constructor(position, rotation) {
        this.setPositionTo(position);
        this.setRotationTo(rotation);
        this.dragOffset = undefined;
        this.dragPosition = undefined;
        this.dragRotation = undefined;
        this.dragValue = undefined;
        this.interactive = true;
        this.animate();
    }

    /** set the center position of the object to parameter point */
    setPositionTo(position) {
        if (position instanceof Point) {
            this.position = position;
        } else if (position instanceof NumberAnimation) {
            this.positionAnimation = position;
        }

        return this;
    }

    /** set the angle of the object to the parameter angle */
    setRotationTo(rotation) {
        if (rotation instanceof NumberAnimation) {
            this.rotationAnimation = rotation;
        } else {
            this.rotation = rotation;
        }

        return this;
    }

    /** update the position and rotation of the object using the animation function properties */
    animate() {
        if (this.hasOwnProperty("positionAnimation") && this.positionAnimation !== undefined) {
            let values = this.positionAnimation.getValues();
            this.position = new Point(values[0], values[1]);
            this.positionAnimation.animate();
        }

        if (this.hasOwnProperty("rotationAnimation") && this.rotationAnimation !== undefined) {
            this.rotation = this.rotationAnimation.getValues();
            this.rotationAnimation.animate();
        }
    }
}

class Scene {
    /** create a scene consisting of lasers, mirrors, and guides from an array of generic objects */
    constructor(objects = []) {
        this.lasers = [];
        this.mirrors = [];
        this.guides = [];
        this.draggedLaser = false;
        this.draggedMirror = false;
        this.draggedGuide = false;
        this.draggedObject = false;

        if (Array.isArray(objects)) {
            return this.addObjects(objects);
        }

        return this.addObject(objects);
    }

    /** get all the objects in the scene as an array of lasers, mirrors, and guides */
    getObjects() {
        let objects = this.lasers.concat(this.mirrors).concat(this.guides);
        return objects;
    }

    /** fix the dragged laser properties of the scene */
    fixDraggedLaser() {
        if (this.draggedObject instanceof Laser) {
            let index = this.lasers.indexOf(this.draggedLaser);

            if (index === -1) {
                this.setDraggedObjectTo(false);
            }
        }

        return this;
    }

    /** fix the dragged mirror properties of the scene */
    fixDraggedMirror() {
        if (this.draggedObject instanceof Mirror) {
            let index = this.mirrors.indexOf(this.draggedMirror);

            if (index === -1) {
                this.setDraggedObjectTo(false);
            }
        }

        return this;
    }

    /** set the guide objects of the scene using parameter array of guides */
    fixDraggedGuide() {
        if (this.draggedObject instanceof Guide) {
            let index = this.guides.indexOf(this.draggedGuide);

            if (index === -1) {
                this.setDraggedObjectTo(false);
            }
        }

        return this;
    }

    /** delete all the lasers, mirrors, and guides */
    reset() {
        this.lasers = [];
        this.mirrors = [];
        this.guides = [];
        this.draggedLaser = false;
        this.draggedMirror = false;
        this.draggedGuide = false;
        this.draggedObject = false;
    }

    /** mark an object of the scene as currently dragged */
    setDraggedObjectTo(object) {
        if (object === false) {
            this.draggedLaser = false;
            this.draggedMirror = false;
            this.draggedGuide = false;
            this.draggedObject = false;
            return;
        }

        if (object instanceof Laser) {
            this.draggedLaser = object;
        } else if (object instanceof Mirror) {
            this.draggedMirror = object;
        } else if (object instanceof Guide) {
            this.draggedGuide = object;
        }

        this.draggedObject = object;
    }

    /** add a laser object to the scene using a parameter laser */
    addLaser(laser) {
        this.lasers.push(laser);
        return this;
    }

    /** remove a laser object from the scene given a reference to parameter laser */
    removeLaser(laser) {
        this.lasers.splice(this.lasers.indexOf(laser), 1);
        this.fixDraggedLaser();
        return this;
    }

    /** add an array of laser objects to the scene using a parameter array of lasers */
    addLasers(lasers) {
        this.lasers = this.lasers.concat(lasers);
        return this;
    }

    /** add a mirror object to the scene using a parameter mirror */
    addMirror(mirror) {
        this.mirrors.push(mirror);
        return this;
    }

    /** remove a mirror object from the scene given a reference to parameter mirror */
    removeMirror(mirror) {
        this.mirrors.splice(this.mirrors.indexOf(mirror), 1);
        this.fixDraggedMirror();
        return this;
    }

    /** add an array of mirror objects to the scene using a parameter array of mirrors */
    addMirrors(mirrors) {
        this.mirrors = this.mirrors.concat(mirrors);
        return this;
    }

    /** add a guide object to the scene using a parameter guide */
    addGuide(guide) {
        this.guides.push(guide);
        return this;
    }

    /** remove a guide object from the scene given a reference to parameter guide */
    removeGuide(guide) {
        this.guides.splice(this.guides.indexOf(guide), 1);
        this.fixDraggedGuide();
        return this;
    }

    /** add an array of guide objects to the scene using a parameter array of guides */
    addGuides(guides) {
        this.guides = this.guides.concat(guides);
        return this;
    }

    /** add a laser, mirror, or guide to the scene using a parameter object */
    addObject(object) {
        if (object instanceof Laser) {
            this.addLaser(object);
        } else if (object instanceof Mirror) {
            this.addMirror(object);
        } else if (object instanceof Guide) {
            this.addGuide(object);
        }

        return this;
    }

    /** remove a laser, mirror, or guide from the scene given a reference to parameter object */
    removeObject(object) {
        if (object instanceof Laser) {
            this.removeLaser(object);
        }

        if (object instanceof Mirror) {
            this.removeMirror(object);
        }

        if (object instanceof Guide) {
            this.removeGuide(object);
        }
    }

    /** add an array of lasers, mirrors, and guides to the scene using a parameter array of objects */
    addObjects(objects) {
        for (let n = 0; n < objects.length; n++) {
            this.addObject(objects[n]);
        }

        return this;
    }

    /** get an array of mirrors in the scene whose contour currently enclose a parameter point */
    getMirrorsWithPointInside(p = pointOrigin) {
        let mirrors = [];

        for (let n = 0; n < this.mirrors.length; n++) {
            let mirror = this.mirrors[n];

            if (mirror.pointInside(p, true)) {
                mirrors.push(mirror);
            }
        }

        return mirrors;
    }

    /** get the closest object from a parameter array of objects to a parameter point */
    static getClosestObjectToPoint(p = pointOrigin, objects = [], distanceModifier = undefined) {
        let closestObject = undefined;
        let distanceToClosestObject = undefined;

        for (let n = 0; n < objects.length; n++) {
            let object = objects[n];
            let distanceToObject = distance(p, object.position);
            let comparedDistance;

            if (distanceModifier !== undefined) {
                comparedDistance = distanceModifier(distanceToObject);
            } else {
                comparedDistance = distanceToObject;
            }

            if (closestObject === undefined || comparedDistance < distanceToClosestObject) {
                closestObject = object;
                distanceToClosestObject = distanceToObject;
            }
        }

        if (closestObject === undefined) {
            return false;
        }

        return {
            object: closestObject,
            distanceToObject: distanceToClosestObject
        };
    }

    /** get the closest mirror to a parameter point in the scene */
    getClosestMirrorToPoint(p = pointOrigin, distanceModifier = undefined) {
        let closest = Scene.getClosestObjectToPoint(p, this.mirrors, distanceModifier);
        return closest;
    }

    /** get an array of mirrors which are currently reflecting in the scene */
    getReflectingMirrors() {
        let mirrors = [];

        for (let n = 0; n < this.mirrors.length; n++) {
            let mirror = this.mirrors[n];

            if (mirror.isReflecting()) {
                mirrors.push(mirror);
            }
        }

        return mirrors;
    }

    /** shine a virtual ray in the scene given a parameter laser and record the collisions with objects as an array of points */
    laser(laser, insideMirrors = [], collisions = [], sideIgnore = null) {
        // stop path tracing if the laser light collides a certain number of times
        if (collisions.length === LASER_MAX_COLLISIONS) {
            return collisions;
        }

        let laserLine = Line.fromRay(laser.position, laser.rotation);
        let closestMirror = undefined;
        let closestIntersection = undefined;
        let distanceToClosestIntersection = undefined;
        let closestSide = undefined;

        // check collision with each mirrors in the scene and record the closest point
        // of intersection in order to find where the light will interact
        for (let n = 0; n < this.mirrors.length; n++) {
            let mirror = this.mirrors[n];
            let lastVertex = undefined;

            if (mirror.closedShape || mirror.isRefracting()) {
                lastVertex = mirror.vertices.length;
            } else {
                lastVertex = mirror.vertices.length - 1;
            }

            // check collision with each side of the polygon mirror
            for (let m = 0; m < lastVertex; m++) {
                let side = mirror.getSide(m, true);

                // prevent collision with side current laser ray originated from
                if (sideIgnore !== null && side.isEqual(sideIgnore)) {
                    continue;
                }

                // find the point of intersection between polygon side segment and laser ray
                let intersection = intersectionSegmentRay(side, laserLine);

                // check if intersection found
                if (intersection !== false) {
                    let distanceToIntersection = distance(laser.position, intersection);

                    // check if intersection is closer than current closest and if it is, update current closest
                    if (closestIntersection === undefined || distanceToIntersection < distanceToClosestIntersection) {
                        closestMirror = mirror;
                        closestIntersection = intersection;
                        distanceToClosestIntersection = distanceToIntersection;
                        closestSide = side;
                    }
                }
            }
        }

        // form a new array of collisions copy with an additional new closest interaction
        let newCollisions = structuredClone(collisions);

        if (closestMirror === undefined) {
            // if no collisions are found, add a final laser light point into the void
            newCollisions.push({
                type: "void",
                position: laser.position.clone().addToPolar(DRAW_RANGE, laser.rotation),
            });
            return newCollisions;
        }

        newCollisions.push({
            position: closestIntersection,
        });

        // recursively find the path of the laser light after interaction
        if (closestMirror.isReflecting()) {
            newCollisions[newCollisions.length - 1].type = "reflection";
            let incidentAngle = Math.asin(laserLine.getSineOfAngleBetweenLinePerpendicular(closestSide));
            let reflectedAngle = incidentAngle;
            newCollisions[newCollisions.length - 1].incidentAngle = incidentAngle;
            newCollisions[newCollisions.length - 1].reflectedAngle = reflectedAngle;
            // reflect light and proceed recursively
            return this.laser(new Laser(closestIntersection, closestSide.getAbsoluteAngleReflected(laser.rotation)), insideMirrors, newCollisions, closestSide);
        } else if (closestMirror.isRefracting()) {
            // conditionally refract light
            // find an array of mirrors which currently encloes the laser light interaction
            let newInsideMirrors = [];

            for (let n = 0; n < insideMirrors.length; n++) {
                newInsideMirrors[n] = insideMirrors[n];
            }

            if (!newInsideMirrors.includes(closestMirror)) {
                newInsideMirrors.push(closestMirror);
            } else {
                newInsideMirrors.splice(newInsideMirrors.indexOf(closestMirror), 1);
            }

            // record the incident and refracted index during interaction
            let incidentIndex = 1;
            let refractedIndex = 1;

            // refraction index of intersecting regions depending on which function (summation or average) is used

            if (insideMirrors.length > 0) {
                // average the indices of refraction of the mirrors which enclose the start of the laser light interaction
                incidentIndex = summation(getPropertiesOfObjects(insideMirrors, "indexOfRefraction"));
            }

            if (newInsideMirrors.length > 0) {
                // average the indices of refraction of the mirrors which enclose the end of the laser light interaction
                refractedIndex = summation(getPropertiesOfObjects(newInsideMirrors, "indexOfRefraction"));
            }

            let criticalAngle = undefined;
            let criticalAngleSine = undefined;

            // find the critical angle sine to determine whether refraction occurs
            if (incidentIndex > refractedIndex) {
                criticalAngleSine = refractedIndex / incidentIndex;
                // find the critical angle just in case if needed
                criticalAngle = Math.asin(criticalAngleSine);
            } else {
                criticalAngleSine = 1;
            }

            // find the angle of incidence in the interaction
            let incidentAngleSine = laserLine.getSineOfAngleBetweenLinePerpendicular(closestSide);
            let incidentAngle = Math.asin(incidentAngleSine);

            newCollisions[newCollisions.length - 1].incidentAngle = incidentAngle;

            // check whether refraction or total internal reflection should occur
            if (incidentAngleSine >= criticalAngleSine) {
                newCollisions[newCollisions.length - 1].type = "reflection";
                let reflectedAngle = incidentAngle;
                newCollisions[newCollisions.length - 1].reflectedAngle = reflectedAngle;
                // reflect (total internal) light and proceed recursively
                return this.laser(new Laser(closestIntersection, closestSide.getAbsoluteAngleReflected(laser.rotation)), insideMirrors, newCollisions, closestSide);
            } else {
                newCollisions[newCollisions.length - 1].type = "refraction";
                newCollisions[newCollisions.length - 1].incidentCount = insideMirrors.length;
                newCollisions[newCollisions.length - 1].refractedCount = newInsideMirrors.length;
                newCollisions[newCollisions.length - 1].incidentIndex = incidentIndex;
                newCollisions[newCollisions.length - 1].refractedIndex = refractedIndex;
                let refractedAngleSine = incidentAngleSine * incidentIndex / refractedIndex;
                let refractedAngle = Math.asin(refractedAngleSine);
                newCollisions[newCollisions.length - 1].refractedAngle = refractedAngle;
                // find angle of refraction in world space and proceed recursively
                return this.laser(new Laser(closestIntersection, laser.rotation - Math.sign(laserLine.getDotProductBetweenLine(closestSide)) * Math.sign(laserLine.getProjectionOfCrossProductBetweenLine(closestSide)) * (incidentAngle - refractedAngle)), newInsideMirrors, newCollisions, closestSide);
            }
        } else if (closestMirror.isAbsorbing()) {
            newCollisions[newCollisions.length - 1].type = "absorption";
            // absorb light and stop recursion
            return newCollisions;
        }
    }

    /** get all the laser paths in the scene as an array of arrays of points */
    getLasersCollisions() {
        let lasersData = [];

        for (let n = 0; n < this.lasers.length; n++) {
            let laser = this.lasers[n];
            lasersData.push(this.laser(laser, this.getMirrorsWithPointInside(laser.position).filter(function (mirror) {
                return mirror.isRefracting();
            })));
        }

        return lasersData;
    }

    /** animate all the lasers and mirrors by updating their positions and rotations in time */
    animate() {
        for (let n = 0; n < this.lasers.length; n++) {
            this.lasers[n].animate();
        }

        for (let n = 0; n < this.mirrors.length; n++) {
            this.mirrors[n].animate();
        }
    }
}

class Laser extends DraggableObject {
    /** create a laser object from a position vector point, rotation angle, and laser brightness from 0 to 1 */
    constructor(position, rotation, brightness = 0.75) {
        super(position, rotation);
        this.brightness = brightness;
        return this;
    }
}

class Mirror extends DraggableObject {
    /**
     * create a mirror object from a position vector point, rotation angle, and index of refraction number
     * as well as from an array of points representing the vertices of the polygon and a parameter determining
     * whether the shape of the polygon is closed from start to end
     */
    constructor(indexOfRefraction, position, rotation, vertices = [], closedShape = true) {
        super(position, rotation);
        this.indexOfRefraction = indexOfRefraction;
        this.vertices = vertices;
        this.closedShape = closedShape;
        return this;
    }

    /** get a fake index of refraction for a refracting mirror */
    static refracting() {
        return 1.5;
    }

    /** get a fake index of refraction for a reflecting mirror */
    static reflecting() {
        return 0.5;
    }

    /** get a fake index of refraction for an absorbing mirror */
    static absorbing() {
        return -0.5;
    }

    /** find if the mirror has a refracting property */
    isRefracting() {
        return this.indexOfRefraction >= 1;
    }

    /** find if the mirror has a reflecting property */
    isReflecting() {
        return this.indexOfRefraction < 1 && this.indexOfRefraction >= 0;
    }

    /** find if the mirror has an absorbing property */
    isAbsorbing() {
        return this.indexOfRefraction < 0;
    }

    /** find if the mirror has not an absorbing property */
    isNotAbsorbing() {
        return !this.isAbsorbing();
    }

    /**
     * get a vertex from the polygon mirror as a point
     * if not absolute, return an existing wrapping vertex in the object space
     * otherwise if absolute, return a new transformed point in the world space
     */
    getVertex(vertexNumber, absolute = false) {
        let vertex = this.vertices[modulus(vertexNumber, this.vertices.length)];

        if (absolute === true) {
            vertex = vertex.clone().rotateAroundPoint(pointOrigin, this.rotation).addTo(this.position);
        }

        return vertex;
    }

    /**
     * get a new side from the polygon mirror as a line
     * if not absolute, return a line with two existing wrapping vertices in the object space
     * otherwise if absolute, return a line with two new transformed points in the world space
     */
    getSide(sideNumber, absolute = false) {
        return new Line(this.getVertex(sideNumber, absolute), this.getVertex(sideNumber + 1, absolute));
    }

    /** get an anonymous object containing 4 rectangularly bounding vertices */
    getExtremes(absolute = false) {
        if (this.vertices.length === 0) {
            return false;
        }

        let leftMost = undefined;
        let rightMost = undefined;
        let upMost = undefined;
        let downMost = undefined;

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.getVertex(n, absolute);

            if (leftMost === undefined || vertex.x <= leftMost.x) {
                leftMost = vertex;
            }

            if (rightMost === undefined || vertex.x >= rightMost.x) {
                rightMost = vertex;
            }

            if (upMost === undefined || vertex.y <= upMost.y) {
                upMost = vertex;
            }

            if (downMost === undefined || vertex.y >= downMost.y) {
                downMost = vertex;
            }
        }

        return {
            leftMost: leftMost,
            rightMost: rightMost,
            upMost: upMost,
            downMost: downMost
        };
    }

    /**
     * find if the polygon mirror encloses point
     * if absolute parameter is false, the point parameter is considered in object space
     * otherwise, if absolute parameter is true, the point parameter is considered in world space
     */
    pointInside(p, absolute = false) {
        let pointOutside = this.getExtremes(absolute).leftMost.clone().subtractTo(new Point(1, 0));
        let lineFromInsideToOutside = new Line(p, pointOutside);
        let sum = 0;

        // calculate the number of sides that intersect with an imaginary line from inside to outside of the polygon
        for (let n = 0; n < this.vertices.length; n++) {
            let side = this.getSide(n, absolute);

            if (intersectSegmentSegment(lineFromInsideToOutside, side)) {
                sum++;
            }
        }

        // if the number of sides intersected is odd, the point is inside the polygon
        // otherwise if it is even, the point is outside the polygon
        return sum % 2 !== 0;
    }

    /** find the area of the polygon mirror as a number */
    findArea() {
        if (this.vertices.length < 3) {
            return 0;
        }

        let sum = 0;

        // uses Shoelace Theorem to find the area of the polygon
        for (let n = 1; n <= this.vertices.length; n++) {
            sum += this.getVertex(n).x * this.getVertex(n + 1).y - this.getVertex(n + 1).x * this.getVertex(n).y;
        }

        // absolute value in case went in wrong direction
        return Math.abs(sum);
    }

    /** find the center of the polygon mirror as a point in world space */
    findCenter(absolute = false) {
        let average = pointOrigin.clone();

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.getVertex(n, absolute);
            average.addTo(vertex);
        }

        average.divideBy(this.vertices.length);

        return average;
    }

    /** translate the vertices of the polygon mirror by a vector point in object space */
    translateVerticesLocally(p) {
        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.addTo(p);
        }

        return this;
    }

    /** scale the vertices of the polygon mirror by an x and y factor from the center in object space */
    scaleVerticesLocally(xs, ys = xs) {
        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.scaleXY(xs, ys);
        }

        return this;
    }

    /**
     * add a number of vertices between existing vertices equal to a number
     * number of new vertices equal to vertices multiplier * number of existing vertices
     */
    subdivideVertices(verticesMultiplier = 2) {
        for (let n = 0; n < this.vertices.length; n++) {
            let side = this.getSide(n);

            for (let m = 1; m < verticesMultiplier; m++) {
                this.vertices.splice(n + 1, 0, side.p1.clone().interpolateToPointLinear(side.p2, m / (verticesMultiplier + 1)));
                n++;
            }
        }

        return this;
    }

    /**
     * smooth the contour of the polygon mirror with a smoothing factor from 0 to 1
     * as well as an iteration multiplier representing number of smoothing passes
     */
    smoothVertices(factor = 0.5, iterationsMultiplier = 1) {
        if (this.vertices.length === 0) {
            return;
        }

        // finding initial area to perform correcting scale later on
        let initialArea = this.findArea(true);

        // do a number of smoothing passes on each vertex of the polygon
        // a smoothing operation moves a vertex towards the midpoint of the neighboring vertices
        for (let n = 0; n < Math.round(this.vertices.length * iterationsMultiplier); n++) {
            let previousVertex = this.getVertex(n - 1);
            let vertex = this.getVertex(n);
            let nextVertex = this.getVertex(n + 1);
            let midPoint = previousVertex.clone().midPointTo(nextVertex);
            vertex.interpolateToPointLinear(midPoint, factor);
        }

        // finding uncorrected area and scaling to retain initial area
        let uncorrectedArea = this.findArea();
        this.scaleVerticesLocally(Math.sqrt(initialArea / uncorrectedArea));
        return this;
    }

    /** set the vertices of the mirror to corners of a rectangle */
    makeRectangle(width, height) {
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let topLeftCorner = new Point(-halfWidth, -halfHeight);
        let topRightCorner = new Point(halfWidth, -halfHeight);
        let bottomRightCorner = new Point(halfWidth, halfHeight);
        let bottomLeftCorner = new Point(-halfWidth, halfHeight);
        this.vertices = [topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner];
        this.closedShape = true;
        return this;
    }

    /** set the vertices of the polygon mirror to points on the edge of a circle (uniformly) */
    makeCircle(radius, vertexCount) {
        this.vertices = [];

        for (let n = 0; n < vertexCount; n++) {
            let vertex = new Point();
            vertex.addToPolar(radius, n / vertexCount * 2 * Math.PI);
            this.vertices.push(vertex);
        }

        this.closedShape = true;
        return this;
    }

    /** set the vertices of the polygon mirror to vertices of a regular polygon with a number of sides */
    makeRegularPolygon(radius, sideCount) {
        this.vertices = [];

        for (let n = 0; n < sideCount; n++) {
            let angle = n / sideCount * 2 * Math.PI;
            this.vertices.push(new Point(radius * Math.cos(angle), radius * Math.sin(angle)));
        }

        this.closedShape = true;
        return this;
    }

    /**
     * set the vertices of the polygon to match the shape of a concave mirror
     * xLength and yLength are the width and height of the concave mirror (respectively)
     */
    makeConcaveMirror(focalLength, yLength, xLength, vertexCount) {
        this.vertices = [];

        for (let n = 0; n < vertexCount; n++) {
            let x = (n / (vertexCount - 1) - 0.5) * yLength;
            this.vertices.push(new Point(Math.pow(x, 2) / (4 * focalLength), x));
        }

        let rightMost = this.getExtremes().rightMost.clone();
        this.vertices.push(new Point(rightMost.x - xLength, yLength / 2), new Point(rightMost.x - xLength, -yLength / 2));

        if (!this.isReflecting()) {
            this.indexOfRefraction = Mirror.reflecting();
        }

        this.closedShape = true;
        return this;
    }

    /**
     * set the vertices of the polygon to match the shape of a convex mirror
     * yLength is the height of the convex mirror
     */
    makeConvexMirror(focalLength, yLength, vertexCount) {
        this.makeConcaveMirror(focalLength, yLength, 0, vertexCount);
        this.vertices.pop();
        this.vertices.pop();
        let rightMost = this.getExtremes().rightMost.clone();

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.x = -vertex.x + rightMost.x;
        }

        if (!this.isReflecting()) {
            this.indexOfRefraction = Mirror.reflecting();
        }

        this.closedShape = true;
        return this;
    }

    /**
     * set the vertices of the polygon to match the shape of a concave lens
     * xLength and yLength are the width and height of the concave lens (respectively)
     * need help with creating correct geometry of lenses
     */
    makeConcaveLens(focalLength, yLength, xLength, vertexCount) {
        this.makeConvexMirror(focalLength, yLength, vertexCount);
        let rightMost = this.getExtremes().leftMost.clone();

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.x += -xLength / 2 + rightMost.x;
        }

        for (let n = this.vertices.length - 2; n >= 1; n--) {
            let vertex = this.vertices[n];
            this.vertices.push(new Point(-(vertex.x + rightMost.x) - rightMost.x - yLength / 60, vertex.y));
        }

        // todo: set index of refraction to special value

        this.closedShape = true;
        return this;
    }

    /**
     * set the vertices of the polygon to match the shape of convex lens
     * yLength is the height of the convex lens
     * need help with creating correct geometry of lenses
     */
    makeConvexLens(focalLength, yLength, vertexCount) {
        this.makeConvexMirror(focalLength, yLength, vertexCount);

        for (let n = this.vertices.length - 2; n >= 1; n--) {
            let vertex = this.vertices[n];
            this.vertices.push(new Point(-vertex.x, vertex.y));
        }

        // todo: set index of refraction to special value

        this.closedShape = true;
        return this;
    }

    /**
     * set the vertices of the polygon to match the shape of a randomized blob
     * averageRadius is the average distance from center to the vertices
     * maxRadiusDeviation is the percent deviation of the radius from 0 to 1
     * maxAngleDeviation is the percent deviation towards the neighboring vertices from 0 to 1
     */
    makeBlob(averageRadius, maxRadiusDeviation, maxAngleDeviation, vertexCount) {
        // 0 > maxAngleDeviation < 1
        this.vertices = [];

        for (let n = 0; n < vertexCount; n++) {
            let radius = clampMin(averageRadius + maxRadiusDeviation * averageRadius * randomFloat(-1, 1), -1);
            let angle = (n + maxAngleDeviation * randomFloat(-1, 1)) / vertexCount * 2 * Math.PI;
            this.vertices.push(new Point(radius * Math.cos(angle), radius * Math.sin(angle)));
        }

        this.closedShape = true;
        return this;
    }
}

class Guide extends DraggableObject {
    /**
     * create a guide tool object from a position vector point, rotation angle
     * and guidance number representing whether the object is a ruler or
     * protractor (0 or 1 respectively) in floating point
     */
    constructor(position, rotation, guidance = 0.25) {
        super(position, rotation);
        this.guidance = guidance;
        return this;
    }
}

class MouseAction {
    /** get the constant for mouse drag action */
    static get drag() {
        return 0;
    }

    /** get the constant for mouse horizontal drag action */
    static get dragX() {
        return 1;
    }

    /** get the constant for mouse vertical drag action */
    static get dragY() {
        return 2;
    }

    /** get the constant for mouse rotation action */
    static get rotate() {
        return 3;
    }

    /** get the constant for mouse object change action */
    static get change() {
        return 4;
    }

    /** get the constant for mouse laser creation action */
    static get laser() {
        return 5;
    }

    /** get the constant for mouse interferer (mirror object) creation action */
    static get interferer() {
        return 6;
    }

    /** get the constant for mouse guide tool creation action */
    static get guide() {
        return 7;
    }
}

class NumberAnimation {
    /**
     * create an animation object which works on numbers as well as vectors
     * from an array of keyframe objects as well as
     * from a global number interpolation function, duration of animation and
     * from a looping boolean parameter
     */
    constructor(keyframes, duration, offset = 0, interpolationFunction = interpolateLinear, isLooping = true) {
        this.time = 0;
        this.keyframes = keyframes;
        this.duration = duration;
        this.offset = offset;
        this.interpolationFunction = interpolationFunction;
        this.isLooping = isLooping;
        return this;
    }

    /**
     * get the value of the animation from the current time in the object
     * as well as from the rest of the parameters
     */
    getValues() {
        // find the nearest left keyframe to the animation time
        let lowKeyframe = undefined;

        for (let n = 0; n < this.keyframes.length; n++) {
            let keyframe = this.keyframes[n];
            if ((lowKeyframe === undefined || keyframe.time >= lowKeyframe.time) && keyframe.time <= this.time + this.offset) {
                lowKeyframe = keyframe;
            }
        }

        // find the nearest right keyframe to the current time
        let highKeyframe = undefined;

        for (let n = 0; n < this.keyframes.length; n++) {
            let keyframe = this.keyframes[n];
            if ((highKeyframe === undefined || keyframe.time <= highKeyframe.time) && keyframe.time >= this.time + this.offset) {
                highKeyframe = keyframe;
            }
        }

        if (lowKeyframe === undefined) {
            return highKeyframe.values;
        }

        if (highKeyframe === undefined) {
            return lowKeyframe.values;
        }

        if (lowKeyframe === highKeyframe) {
            return lowKeyframe.values;
        }

        // map the animation time from animation time space to keyframe time space
        let mapped = map(this.time + this.offset, lowKeyframe.time, highKeyframe.time, 0, 1);

        // interpolate the numbers or vectors using the left and right nearest keyframe
        if (Array.isArray(this.keyframes[0].values)) {
            let values = [];

            for (let n = 0; n < this.keyframes[0].values.length; n++) {
                values.push(this.interpolationFunction(lowKeyframe.values[n], highKeyframe.values[n], mapped));
            }

            return values;
        } else {
            return this.interpolationFunction(lowKeyframe.values, highKeyframe.values, mapped);
        }
    }

    /** step forward the animation time by one and loop to start if is looping */
    animate() {
        this.time += timeScale;

        if (this.isLooping) {
            while (this.time + this.offset >= this.duration) {
                this.time -= this.duration;
            }
        }

        return this;
    }
}

class AnimationKeyframe {
    /**
     * create a animation keyframe object meant to be used for animation objects
     * from the keyframe time number and keyframe values (number or vector) to be interpolated
     */
    constructor(time, values) {
        this.time = time;
        this.values = values;
        return this;
    }
}

// declare global variables and constants
let request = undefined;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});
const clearButton = document.getElementById("button-clear-scene");
const loadButton1 = document.getElementById("button-load-scene-1");
const loadButton2 = document.getElementById("button-load-scene-2");
const loadButton3 = document.getElementById("button-load-scene-3");
const loadButton4 = document.getElementById("button-load-scene-4");
const loadButton5 = document.getElementById("button-load-scene-5");
const loadButton6 = document.getElementById("button-load-scene-6");
const loadButton7 = document.getElementById("button-load-scene-7");
const loadButton8 = document.getElementById("button-load-scene-8");
const loadButton9 = document.getElementById("button-load-scene-9");
const updateObjectButton = document.getElementById("button-update-object")
const updateCollisionButton = document.getElementById("button-update-collision");
const objectTable = document.getElementById("table-object");
const collisionTable = document.getElementById("table-collision");
const wallpaperImage = document.getElementById("image-wallpaper");
const tileImage = document.getElementById("image-tile");
const laserImage = document.getElementById("image-laser");
const rulerImage = document.getElementById("image-ruler");
const protractorImage = document.getElementById("image-protractor");
const pointImage = document.getElementById("icon-point");
const grabImage = document.getElementById("icon-grab");
const objectImage = document.getElementById("icon-object");
const dragXImage = document.getElementById("icon-dragX");
const dragYImage = document.getElementById("icon-dragY");
const dragImage = document.getElementById("icon-drag");
const rotateImage = document.getElementById("icon-rotate");
const changeImage = document.getElementById("icon-change");
const addLaserImage = document.getElementById("icon-laser");
const addInterfererImage = document.getElementById("icon-interferer");
const addRulerImage = document.getElementById("icon-ruler");
const addProtractorImage = document.getElementById("icon-protractor");
const letterXImage = document.getElementById("icon-letter-x");
const letterYImage = document.getElementById("icon-letter-y");
const letterTImage = document.getElementById("icon-letter-t");
const letterRImage = document.getElementById("icon-letter-r");
const letterCImage = document.getElementById("icon-letter-c");
const letterLImage = document.getElementById("icon-letter-l");
const letterIImage = document.getElementById("icon-letter-i");
const letterGImage = document.getElementById("icon-letter-g");
const clickSound = document.getElementById("sound-click");
const misclickSound = document.getElementById("sound-misclick");
const switchSound = document.getElementById("sound-switch");
let glow = true;
const pointOrigin = new Point(0, 0);
const cameraPosition = pointOrigin.clone();
const targetPosition = cameraPosition.clone();
const mousePosition = pointOrigin.clone();
let mousePressed = false;
let mouseAction = MouseAction.drag;
const keysPressed = [];
let keysFired = false;
let keysHelp = 0;
let touch = false;
let mobilePanning = true;
const LASER_MAX_COLLISIONS = 50;
const DRAW_RANGE = 10000;
const scene = new Scene();
let time = 0;
let previousTime = Date.now();
const targetFramerate = 60;
let framerate = targetFramerate;
let deltaTime = 1000 / framerate;
let timeScale = 1;

// prevent right click registration
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
clearButton.addEventListener("click", (event) => loadExample(0));
loadButton1.addEventListener("click", (event) => loadExample(1));
loadButton2.addEventListener("click", (event) => loadExample(2));
loadButton3.addEventListener("click", (event) => loadExample(3));
loadButton4.addEventListener("click", (event) => loadExample(4));
loadButton5.addEventListener("click", (event) => loadExample(5));
loadButton6.addEventListener("click", (event) => loadExample(6));
loadButton7.addEventListener("click", (event) => loadExample(7));
loadButton8.addEventListener("click", (event) => loadExample(8));
loadButton9.addEventListener("click", (event) => loadExample(9));
updateObjectButton.addEventListener("click", (event) => updateObjectTable());
updateCollisionButton.addEventListener("click", (event) => updateCollisionTable());

/** render a step of the simulation based on the time variable */
function render() {
    // finding the delta time from the previous and current frame times
    let currentTime = Date.now();
    deltaTime = currentTime - previousTime;
    previousTime = currentTime;

    // find the framerate of the simulation
    if (numberMatches(deltaTime, 0, 1e-9) === true) {
        framerate = targetFramerate;
    } else {
        framerate = 1000 / deltaTime;
    }

    // set the time scale of the simulation using the clamped framerate
    timeScale = targetFramerate / clampMin(framerate, 20);

    // calculating properties of the object dragged by the mouse currently
    if (scene.draggedObject !== false) {
        if (mouseAction === MouseAction.drag) {
            // drag the object horizontally and vertically to match the position of the mouse
            scene.draggedObject.position.setTo(mousePosition).addTo(cameraPosition).subtractTo(scene.draggedObject.dragOffset);
        } else if (mouseAction === MouseAction.dragX) {
            // drag the object horizontally to match the horizontal position of the mouse
            scene.draggedObject.position.x = mousePosition.x + cameraPosition.x - scene.draggedObject.dragOffset.x;
        } else if (mouseAction === MouseAction.dragY) {
            // drag the object vertically to match the vertical position of the mouse
            scene.draggedObject.position.y = mousePosition.y + cameraPosition.y - scene.draggedObject.dragOffset.y;
        } else if (mouseAction === MouseAction.rotate) {
            // rotate the object to point away from mouse position at the object position
            // creating a line from the object to the mouse and finding the angle
            let line = new Line(scene.draggedObject.position.clone().subtractTo(cameraPosition), mousePosition);
            scene.draggedObject.rotation = modulus(line.getAngle(), 2 * Math.PI);
        } else if (mouseAction === MouseAction.change) {
            if (scene.draggedObject instanceof Mirror) {
                // change the lens' index of refraction based on the vertical displacement of the mouse
                scene.draggedMirror.indexOfRefraction = clampMin(scene.draggedMirror.dragValue + (scene.draggedMirror.mousePositionOnDrag.y - mousePosition.y) / 100, -2);
            } else if (scene.draggedObject instanceof Laser) {
                // change the laser's brightness either to 0 or to 1 based on the vertical displacement of the mouse
                scene.draggedLaser.brightness = clamp(map(Math.round(modulus(scene.draggedLaser.dragBrightness + (scene.draggedLaser.mousePositionOnDrag.y - mousePosition.y) / 300, 1)), 0, 1, 0.25, 0.75), 0, 1);
            } else if (scene.draggedObject instanceof Guide) {
                // change the guide tool's guidance property to 0 or to 1 based on the vertical displacement of the mouse
                // determining whether to show a ruler or protractor
                scene.draggedGuide.guidance = clamp(map(Math.round(modulus(scene.draggedGuide.dragGuidance + (scene.draggedGuide.mousePositionOnDrag.y - mousePosition.y) / 300, 1)), 0, 1, 0.25, 0.75), 0, 1);
            }
        }
    }

    // progress forward the property animations of each object in the scene by one step
    scene.animate();

    // move the camera left, right, up, or down based on the pressed and held key

    if (keysPressed.includes("ArrowLeft") || keysPressed.includes("a") || keysPressed.includes("A") || (mousePosition.x < -660 && mousePressed === true && touch === true && mobilePanning === true)) {
        targetPosition.x -= 10 * timeScale;
    }

    if (keysPressed.includes("ArrowRight") || keysPressed.includes("d") || keysPressed.includes("D") || (mousePosition.x > 660 && mousePressed === true && touch === true && mobilePanning === true)) {
        targetPosition.x += 10 * timeScale;
    }

    if (keysPressed.includes("ArrowUp") || keysPressed.includes("w") || keysPressed.includes("W") || (mousePosition.y < -340 && mousePressed === true && touch === true && mobilePanning === true)) {
        targetPosition.y -= 10 * timeScale;
    }

    if (keysPressed.includes("ArrowDown") || keysPressed.includes("s") || keysPressed.includes("S") || (mousePosition.y > 340 && mousePressed === true && touch === true && mobilePanning === true)) {
        targetPosition.y += 10 * timeScale;
    }

    targetPosition.x = clamp(targetPosition.x, -0.5 * DRAW_RANGE, 0.5 * DRAW_RANGE);
    targetPosition.y = clamp(targetPosition.y, -0.5 * DRAW_RANGE, 0.5 * DRAW_RANGE);

    // linearly interpolate the camera position from the target position
    cameraPosition.interpolateToPointLinear(targetPosition, 1 - Math.pow(0.9, timeScale));

    // find the paths of collisions of the lasers in the scene as an array of arrays of point objects
    let lasersCollisions = scene.getLasersCollisions();

    // if the user is dragging a protractor, snap the position of the protractor to the position of the closest laser collision with mirror
    if (scene.draggedGuide !== false && mouseAction === MouseAction.drag && scene.draggedObject instanceof Guide && Math.round(scene.draggedObject.guidance) === 1) {
        let objects = [];
        for (let n = 0; n < lasersCollisions.length; n++) {
            objects.push({position: scene.lasers[n].position});
            let laserCollisions = lasersCollisions[n];

            for (let m = 0; m < laserCollisions.length; m++) {
                let laserCollision = laserCollisions[m];
                objects.push({position: laserCollision.position});
            }
        }

        let closest = Scene.getClosestObjectToPoint(scene.draggedObject.position, objects);

        // do the position snap if the distance to the object is less than 50 pixels
        if (closest !== false && closest.distanceToObject <= 50) {
            scene.draggedObject.position.setTo(closest.object.position);
        }
    }

    // reset the canvas color to black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1920, 1080);
    // go from canvas space to world space with just a translation
    ctx.translate(960 - cameraPosition.x, 540 - cameraPosition.y);
    // render the tiled background
    ctx.fillStyle = ctx.createPattern(tileImage, "repeat");
    ctx.shadowBlur = 0;
    ctx.fillRect(cameraPosition.x - 960, cameraPosition.y - 540, 1920, 1080);

    // render each guide tool in the scene appropriately
    for (let n = 0; n < scene.guides.length; n++) {
        let guide = scene.guides[n];

        // set to half opacity if guide tool not being dragged
        if (scene.draggedObject === false || !scene.draggedObject instanceof Guide || scene.draggedObject !== guide) {
            ctx.globalAlpha = 0.5;
        }

        // go from world space to object space
        ctx.save();
        ctx.translate(guide.position.x, guide.position.y);
        ctx.rotate(guide.rotation);

        // render either the ruler or protractor overlay depending on the guidance
        if (Math.round(guide.guidance) === 0) {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(rulerImage, -400, -57.5, 800, 115);
        } else {
            ctx.drawImage(protractorImage, -300, -300, 600, 600);
        }

        // go from object space to world space
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    ctx.lineWidth = 5;
    ctx.lineJoin = "round";

    let mirrors = scene.mirrors;

    // render the absorbing, reflective and refractive interferers
    for (let n = 0; n < 3; n++) {
        let selectedMirrors = undefined;

        // group the interferers based on whether they are absorbing (white)
        // and whether they are not absorbing and not selected (red)
        // and whether they are not absorbing and selected (blue)
        if (n === 0) {
            selectedMirrors = mirrors.filter(function (mirror) {
                return mirror.isAbsorbing();
            });

            ctx.strokeStyle = "#ffffff";
        } else {
            if (n === 1) {
                selectedMirrors = mirrors.filter(function (mirror) {
                    return mirror.isNotAbsorbing();
                });

                if (scene.draggedMirror !== false) {
                    let index = selectedMirrors.indexOf(scene.draggedMirror);

                    if (index !== -1) {
                        selectedMirrors.splice(index, 1);
                    }
                }

                ctx.strokeStyle = "#ff0000";
                ctx.shadowBlur = getGlowBlur(20);
            } else {
                if (scene.draggedMirror === false) {
                    selectedMirrors = [];
                } else {
                    selectedMirrors = [scene.draggedMirror];
                }

                ctx.strokeStyle = "#00d0ff";
                ctx.shadowBlur = getGlowBlur(40);
            }

            ctx.shadowColor = ctx.strokeStyle;
            ctx.fillStyle = ctx.strokeStyle;
        }

        // render the group of white, red or blue interferers
        for (let m = 0; m < selectedMirrors.length; m++) {
            let mirror = selectedMirrors[m];
            let vertices = mirror.vertices;
            // go from world space to object space
            ctx.save();
            ctx.translate(mirror.position.x, mirror.position.y);
            ctx.rotate(mirror.rotation);
            // draw a path of lines connecting the vertices
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);

            for (let v = 1; v < vertices.length; v++) {
                let vertex = vertices[v];
                ctx.lineTo(vertex.x, vertex.y);
            }

            if (mirror.closedShape || mirror.isRefracting()) {
                ctx.closePath();
            }

            ctx.stroke();

            // render with fill if the interferer is refracting
            // and opacity of fill based on a modified sigmoid function
            if (mirror.isRefracting()) {
                ctx.globalAlpha = clamp(1 - 1 / Math.pow(Math.E, 0.1 * (mirror.indexOfRefraction - 1)), 0, 1);
                ctx.shadowBlur = 0;
                ctx.fill();
            }
            ctx.restore();
        }
    }

    ctx.lineWidth = 3;

    // render all the laser paths in the scene
    for (let n = 0; n < lasersCollisions.length; n++) {
        let laser = scene.lasers[n];
        let laserCollisions = lasersCollisions[n];

        // check and render laser path if laser is turned on
        if (Math.round(laser.brightness) !== 0) {
            ctx.strokeStyle = "hsl(120, 100%, 50%)";
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = getGlowBlur(20);
            ctx.globalAlpha = clamp(Math.round(laser.brightness), 0, 1);
            ctx.beginPath();
            ctx.moveTo(laser.position.x, laser.position.y);

            for (let m = 0; m < laserCollisions.length; m++) {
                let laserCollision = laserCollisions[m];
                ctx.lineTo(laserCollision.position.x, laserCollision.position.y);
            }

            ctx.stroke();
        }
    }

    // render each actual laser object in the scene
    for (let l = 0; l < scene.lasers.length; l++) {
        let laser = scene.lasers[l];
        ctx.globalAlpha = 1;

        if (scene.draggedObject === laser) {
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = getGlowBlur(30);
        } else {
            ctx.shadowBlur = 0;
        }

        // go from world space to object space
        ctx.save();
        ctx.translate(laser.position.x, laser.position.y);
        ctx.rotate(laser.rotation);
        // draw the laser tool overlay
        ctx.drawImage(laserImage, -204.3, -18.7, 204.3, 37.3);
        // go from object space to world space
        ctx.restore();
    }

    // draw text overlay if user is currently dragging an object
    if (scene.draggedObject !== false) {
        let text = undefined;
        let doDrawText = true;

        // check and set the text to indicate the horizontal position of the object
        if (mouseAction === MouseAction.dragX) {
            text = "x: " + Math.round(scene.draggedObject.position.x).toString();
        }

        // check and set the text to indicate the vertical position of the object
        if (mouseAction === MouseAction.dragY) {
            text = "y: " + Math.round(-scene.draggedObject.position.y).toString();
        }

        // check and set the text to indicate the position of the object
        if (mouseAction === MouseAction.drag) {
            text = "x: " + Math.round(scene.draggedObject.position.x).toString() + ", y: " + Math.round(-scene.draggedObject.position.y).toString();
        }

        // check and set the text to indicate the rotation of the object
        if (mouseAction === MouseAction.rotate) {
            text = "r: " + Math.round(modulus((2 * Math.PI - scene.draggedObject.rotation) * 180 / Math.PI, 360)).toString() + " deg";
        }

        // check and set the text depending on which object is currently being dragged
        if (mouseAction === MouseAction.change) {
            if (scene.draggedObject instanceof Laser) {
                // set the text to indicate whether the laser is toggled on or off
                if (Math.round(scene.draggedLaser.brightness) === 1) {
                    text = "Laser: ON";
                } else {
                    text = "Laser: OFF";
                }
            } else if (scene.draggedObject instanceof Mirror) {
                if (scene.draggedMirror.isRefracting()) {
                    // set the text to indicate the index of refraction of the lens
                    text = "Refractive, IOR: " + (Math.round(100 * scene.draggedObject.indexOfRefraction) / 100).toString();
                }

                if (scene.draggedMirror.isReflecting()) {
                    // set the text to indicate that the interferer is reflective
                    text = "Reflective";
                }

                if (scene.draggedMirror.isAbsorbing()) {
                    // set the text to indicate that the interferer is absorptive
                    text = "Absorptive";
                }
            }

            if (scene.draggedObject instanceof Guide) {
                // set the text to indicate that the guide tool is a ruler or protractor
                if (Math.round(scene.draggedGuide.guidance) === 0) {
                    text = "Ruler";
                } else {
                    text = "Protractor";
                }
            }
        }

        // do text offsets and do the actual rendering of the text as well as its background
        if (doDrawText) {
            let extraSpace = 0;

            // determining whether the currently dragged object's text needs an offset
            if (scene.draggedObject instanceof Laser) {
                // offset the text to reveal the beam of light
                if (scene.draggedLaser.rotation < Math.PI) {
                    extraSpace = -70;
                } else {
                    extraSpace = 70;
                }
            } else if (scene.draggedObject instanceof Guide && Math.round(scene.draggedObject.guidance) === 1) {
                // offset the text of the protractor to reveal its center
                extraSpace = 100;
            }

            // find the width of the text in pixels to be used for centering the text
            let textWidth = ctx.measureText(text).width;

            // render the text overlay's background
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#000000";
            ctx.fillRect(scene.draggedObject.position.x - textWidth / 2 - 5, scene.draggedObject.position.y - 25 - 5 + extraSpace, textWidth + 10, 50 + 10);

            // render the text overlay's text
            ctx.fillStyle = "#ffffff";
            ctx.font = "50px Verdana";
            ctx.fillText(text, scene.draggedObject.position.x - textWidth / 2, scene.draggedObject.position.y + 25 + extraSpace);
        }
    }

    // go from world space to canvas space
    ctx.resetTransform();

    ctx.shadowBlur = 0;
    // go from canvas space to button space
    ctx.translate(0, 540);

    ctx.fillStyle = "#222222";
    // render the canvas buttons' background
    ctx.fillRect(-10, -310, 160, 540);
    ctx.fillRect(1770, -310, 160, 460);

    // use gray as the background color otherwise if the button is active
    // then use blue as the background color
    let dragXColor = "#111111";
    let dragYColor = "#111111";
    let dragColor = "#111111";
    let rotateColor = "#111111";
    let changeColor = "#111111";
    let laserColor = "#111111";
    let interfererColor = "#111111";
    let guideColor = "#111111";

    if (mouseAction === MouseAction.dragX) {
        dragXColor = "#42b6f5";
    } else if (mouseAction === MouseAction.dragY) {
        dragYColor = "#42b6f5";
    } else if (mouseAction === MouseAction.drag) {
        dragColor = "#42b6f5";
    } else if (mouseAction === MouseAction.rotate) {
        rotateColor = "#42b6f5";
    } else if (mouseAction === MouseAction.change) {
        changeColor = "#42b6f5";
    } else if (mouseAction === MouseAction.laser) {
        laserColor = "#42b6f5";
    } else if (mouseAction === MouseAction.interferer) {
        interfererColor = "#42b6f5";
    } else if (mouseAction === MouseAction.guide) {
        guideColor = "#42b6f5";
    }

    // render each individual button's background
    ctx.fillStyle = dragXColor;
    ctx.fillRect(0, -300, 68, 70);
    ctx.fillStyle = dragYColor;
    ctx.fillRect(74, -300, 68, 70);
    ctx.fillStyle = dragColor;
    ctx.fillRect(0, -220, 140, 140);
    ctx.fillStyle = rotateColor;
    ctx.fillRect(0, -70, 140, 140);
    ctx.fillStyle = changeColor;
    ctx.fillRect(0, 80, 140, 140);
    ctx.fillStyle = laserColor;
    ctx.fillRect(1780, -300, 140, 140);
    ctx.fillStyle = interfererColor;
    ctx.fillRect(1780, -150, 140, 140);
    ctx.fillStyle = guideColor;
    ctx.fillRect(1780, 0, 140, 140);

    // check and set whether it's best to show the icon symbols or letters
    if (((distance(new Point(mousePosition.x + 960, mousePosition.y), new Point(0, 0)) < 500 || distance(new Point(mousePosition.x + 960, mousePosition.y), new Point(1920, 0)) < 500) && scene.draggedObject === false) || touch === true) {
        keysHelp = clampMin(keysHelp - 0.05 * timeScale, 0);
    } else {
        keysHelp = clampMax(keysHelp + 0.05 * timeScale, 1);
    }

    // check and draw the icon letters
    if (keysHelp > 0.01) {
        ctx.globalAlpha = clamp(keysHelp, 0, 1);
        ctx.drawImage(letterXImage, 17, -283, 36, 36);
        ctx.drawImage(letterYImage, 91, -283, 36, 36);
        ctx.drawImage(letterTImage, 34, -186, 72, 72);
        ctx.drawImage(letterRImage, 34, -36, 72, 72);
        ctx.drawImage(letterCImage, 34, 114, 72, 72);
        ctx.drawImage(letterLImage, 1814, -266, 72, 72);
        ctx.drawImage(letterIImage, 1814, -116, 72, 72);
        ctx.drawImage(letterGImage, 1814, 34, 72, 72);
    }

    // check and draw the icon symbols
    if (keysHelp < 0.99) {
        ctx.globalAlpha = clamp(1 - keysHelp, 0, 1);
        ctx.drawImage(dragXImage, 17, -283, 36, 36);
        ctx.drawImage(dragYImage, 90, -283, 36, 36);
        ctx.drawImage(dragImage, 34, -186, 72, 72);
        ctx.drawImage(rotateImage, 34, -36, 72, 72);
        ctx.drawImage(changeImage, 34, 114, 72, 72);
        ctx.drawImage(addLaserImage, 1814, -266, 72, 72);
        ctx.drawImage(addInterfererImage, 1814, -116, 72, 72);

        // show a ruler or protractor icon depending which will be added first
        if (scene.guides.length === 0) {
            ctx.drawImage(addRulerImage, 1814, 34, 72, 72);
        } else if (scene.guides.length === 1) {
            if (Math.round(scene.guides[0].guidance) === 0) {
                ctx.drawImage(addProtractorImage, 1814, 34, 72, 72);
            } else {
                ctx.drawImage(addRulerImage, 1814, 34, 72, 72);
            }
        } else if (scene.guides.length === 2) {
            if (Math.round(scene.guides[1].guidance) === 0) {
                ctx.drawImage(addProtractorImage, 1814, 34, 72, 72);
            } else {
                ctx.drawImage(addRulerImage, 1814, 34, 72, 72);
            }
        }
    }

    ctx.globalAlpha = 1;
    // go from button space to canvas space
    ctx.resetTransform();

    // check if time ranges from 0 to 120 and draw the canvas wallpaper
    if (time <= 120) {
        if (time < 60) {
            ctx.globalAlpha = 1;
        } else {
            ctx.globalAlpha = clamp(map(time, 60, 120, 1, 0), 0, 1);
        }

        ctx.fillStyle = "#000000";
        // draw the background of the wallpaper
        ctx.fillRect(0, 0, 1920, 1080)
        // draw the canvas wallpaper
        ctx.drawImage(wallpaperImage, 0, 0);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#000000";

    // go from canvas space to mouse space
    ctx.save();
    ctx.translate(mousePosition.x + 960, mousePosition.y + 540);

    // draw the mouse's associated mouse action icon
    if (scene.draggedObject === false) {
        if (mouseAction === MouseAction.laser || mouseAction === MouseAction.interferer || mouseAction === MouseAction.guide) {
            ctx.drawImage(objectImage, -18, -18, 36, 36);
        } else {
            ctx.drawImage(pointImage, -5, -5, 36, 36);
        }
    } else {
        if (mouseAction === MouseAction.drag) {
            ctx.drawImage(dragImage, -18, -18, 36, 36);
        } else if (mouseAction === MouseAction.dragX) {
            ctx.drawImage(dragXImage, -18, -18, 36, 36);
        } else if (mouseAction === MouseAction.dragY) {
            ctx.drawImage(dragYImage, -18, -18, 36, 36);
        } else if (mouseAction === MouseAction.rotate) {
            ctx.drawImage(rotateImage, -18, -18, 36, 36);
        } else if (mouseAction === MouseAction.change) {
            ctx.drawImage(grabImage, -18, -18, 36, 36);
        }
    }

    // go from mouse space to canvas space
    ctx.restore();
    time += timeScale;
    request = window.requestAnimationFrame(render);
}

/** function to reset the scene and set the objects to match a hardcoded value */
function loadExample(n) {
    scene.reset();
    // recenter the camera position
    targetPosition.setTo(pointOrigin);

    switch (n) {
        case 0:
            break;
        case 1:
            scene.addLaser(new Laser(new Point(100, -250), Math.PI / 4));
            let triangle = new Mirror(Mirror.absorbing(), new Point(-300, 375), 0)
            triangle.makeRegularPolygon(150, 3);
            triangle.setRotationTo(Math.PI / 10);
            let square = new Mirror(Mirror.absorbing(), new Point(595, -275), Math.PI / 4)
            square.makeRectangle(400, 400);
            square.setRotationTo(Math.PI / 4);
            let rectangle = new Mirror(Mirror.reflecting(), new Point(-600, -100), Math.PI / 10)
            rectangle.makeRectangle(40, 400);
            rectangle.setRotationTo(Math.PI / 10);
            let polygon = new Mirror(Mirror.absorbing(), new Point(600, 400), 0);
            polygon.makeRegularPolygon(150, 5);
            let circle = new Mirror(3, new Point(100, 50), 0);
            circle.makeCircle(150, 500);
            scene.addMirrors([triangle, square, rectangle, polygon, circle]);
            break;
        case 2:
            scene.addLaser(new Laser(new Point(-150, -200), Math.PI / 10));

            for (let x = -2; x <= 2; x++) {
                for (let y = -1; y <= 1; y++) {
                    let position = new Point(300 * x, 300 * y);
                    let square = new Mirror(3, new NumberAnimation([new AnimationKeyframe(0, [position.x, position.y]), new AnimationKeyframe(randomFloat(90, 110), [position.x + randomFloat(40, 60), position.y + randomFloat(40, 60)]), new AnimationKeyframe(200, [position.x, position.y])], 200, 0, interpolateElastic), new NumberAnimation([new AnimationKeyframe(0, 0), new AnimationKeyframe(20, Math.PI / 100), new AnimationKeyframe(40, 0)], 40, 0, interpolateLinear));
                    square.makeRectangle(150, 150);
                    scene.addMirror(square);
                }
            }
            break;
        case 3:
            scene.addLaser(new Laser(new Point(-700, -300), Math.PI / 10));
            let blob = new Mirror(Mirror.reflecting(), new Point(0, 0), new NumberAnimation([new AnimationKeyframe(0, 0), new AnimationKeyframe(5000, 6 * Math.PI)], 5000, 0, interpolateLinear));
            blob.makeBlob(300, 0.9, 0.9, 100);
            blob.smoothVertices(0.5, 10);
            scene.addMirror(blob);
            break;
        case 4:
            scene.addLaser(new Laser(new Point(700, 0), Math.PI, 1));
            scene.addMirrors([
                new Mirror(Mirror.absorbing(), new Point(0, 0), 0).makeRectangle(1500, 1000),
                new Mirror(Mirror.reflecting(), new Point(350, 300), 1.2 * Math.PI).makeRectangle(300, 50),
                new Mirror(Mirror.reflecting(), new Point(-300, -400), 1.9 * Math.PI).makeRectangle(300, 50),
                new Mirror(Mirror.reflecting(), new Point(400, -300), 1.1 * Math.PI).makeRectangle(300, 50),
                new Mirror(Mirror.reflecting(), new Point(0, 0), 0.7 * Math.PI).makeRectangle(300, 50),
                new Mirror(Mirror.reflecting(), new Point(-500, 300), 0.3 * Math.PI).makeRectangle(300, 50),
            ]);
            scene.mirrors[0].interactive = false;
            break;
        case 5:
            scene.addLasers([
                new Laser(new Point(-100, -200), 0),
                new Laser(new Point(-100, -100), 0),
                new Laser(new Point(-100, -0), 0),
                new Laser(new Point(-100, 100), 0),
                new Laser(new Point(-100, 200), 0),
            ]);
            let parabola = new Mirror(Mirror.reflecting(), new Point(300, 0), Math.PI);
            parabola.makeConcaveMirror(200, 600, 175, 200);
            scene.addMirror(parabola);
            break;
        case 6:
            scene.addLasers([
                new Laser(new Point(-100, -200), 0),
                new Laser(new Point(-100, -100), 0),
                new Laser(new Point(-100, -0), 0),
                new Laser(new Point(-100, 100), 0),
                new Laser(new Point(-100, 200), 0),
            ]);
            let parabola2 = new Mirror(Mirror.reflecting(), new Point(300, 0), Math.PI);
            parabola2.makeConvexMirror(200, 600, 200);
            scene.addMirror(parabola2);
            break;
        case 7:
            scene.addLasers([
                new Laser(new Point(-100, -200), 0),
                new Laser(new Point(-100, -100), 0),
                new Laser(new Point(-100, -0), 0),
                new Laser(new Point(-100, 100), 0),
                new Laser(new Point(-100, 200), 0),
            ]);
            let parabola3 = new Mirror(Mirror.refracting(), new Point(300, 0), 0);
            parabola3.makeConvexLens(200, 600, 200);
            scene.addMirror(parabola3);
            break;
        case 8:
            scene.addLasers([
                new Laser(new Point(-100, -200), 0),
                new Laser(new Point(-100, -100), 0),
                new Laser(new Point(-100, -0), 0),
                new Laser(new Point(-100, 100), 0),
                new Laser(new Point(-100, 200), 0),
            ]);
            let parabola4 = new Mirror(Mirror.refracting(), new Point(300, 0), 0);
            parabola4.makeConcaveLens(200, 600, 300, 200);
            scene.addMirror(parabola4);
            break;
        case 9:
            scene.addLaser(new Laser(new Point(0, 0), new NumberAnimation([new AnimationKeyframe(0, 0), new AnimationKeyframe(1000, 2 * Math.PI)], 1000, 0, interpolateLinear)));
            scene.addMirrors([
                new Mirror(2, new Point(-250, 0), 0).makeConcaveLens(200, 500, 200, 200),
                new Mirror(2, new Point(250, 0), 0).makeConcaveLens(200, 500, 200, 200),
                new Mirror(Mirror.reflecting(), new NumberAnimation([new AnimationKeyframe(0, [-700, -400]), new AnimationKeyframe(125, [700, -400]), new AnimationKeyframe(200, [700, 400]), new AnimationKeyframe(325, [-700, 400]), new AnimationKeyframe(400, [-700, -400])], 400, 0, interpolateQuadratic), 0).makeRectangle(200, 200),
                new Mirror(Mirror.reflecting(), new NumberAnimation([new AnimationKeyframe(0, [-700, -400]), new AnimationKeyframe(125, [700, -400]), new AnimationKeyframe(200, [700, 400]), new AnimationKeyframe(325, [-700, 400]), new AnimationKeyframe(400, [-700, -400])], 400, 200, interpolateQuadratic), 0).makeRectangle(200, 200),
            ]);
            break;
    }
}

function updateObjectTable() {
    let newBody = document.createElement("tbody");
    let objects = scene.getObjects();

    for(let n = 0; n < objects.length; n++) {
        let object = objects[n];
        let row = newBody.insertRow(-1);
        let cell1 = row.insertCell(-1);
        cell1.innerText = (n + 1).toString();
        let cell2 = row.insertCell(-1);

        if (object instanceof Laser) {
            cell2.innerText = (scene.lasers.indexOf(object) + 1).toString();
        } else {
            cell2.innerText = "-";
        }

        let cell3 = row.insertCell(-1);

        if (object instanceof Laser) {
            cell3.innerText = "Laser";
        } else if (object instanceof Mirror) {
            cell3.innerText = "Interferer";
        } else if (object instanceof Guide) {
            cell3.innerText = "Guide";
        } else {
            cell3.innerText = "-";
        }

        let cell4 = row.insertCell(-1);

        if (object instanceof Laser) {
            if (Math.round(object.brightness) === 1) {
                cell4.innerText = "Turned On"
            } else {
                cell4.innerText = "Turned Off";
            }
        } else if (object instanceof Mirror) {
            if (object.isReflecting()) {
                cell4.innerText = "Reflective";
            } else if (object.isRefracting()) {
                cell4.innerText = "Refractive";
            } else if (object.isAbsorbing()) {
                cell4.innerText = "Absorptive";
            }
        } else if (object instanceof Guide) {
            if (Math.round(object.guidance) === 0) {
                cell4.innerText = "Ruler";
            } else {
                cell4.innerText = "Protractor";
            }
        }

        let cell5 = row.insertCell(-1);

        if (object instanceof Mirror && object.isRefracting()) {
            cell5.innerText = (Math.round(100 * object.indexOfRefraction) / 100).toString();
        } else {
            cell5.innerText = "-";
        }

        let cell6 = row.insertCell(-1);

        if (object instanceof Mirror) {
            cell6.innerText = object.vertices.length.toString();
        } else {
            cell6.innerText = "-";
        }

        let cell7 = row.insertCell(-1);
        cell7.innerText = "(" + (Math.round(10 * object.position.x) / 10).toString() + ", " + (Math.round(-10 * object.position.y) / 10).toString() + ")";

        let cell8 = row.insertCell(-1);
        cell8.innerText = (Math.round(100 * object.rotation * 180 / Math.PI) / 100).toString() + " deg";
    }

    let oldBody = objectTable.getElementsByTagName("tbody")[0];
    oldBody.parentNode.replaceChild(newBody, oldBody);
}

function updateCollisionTable() {
    let newBody = document.createElement("tbody");
    let lasersCollisions = scene.getLasersCollisions();

    for(let n = 0; n < lasersCollisions.length; n++) {
        let laserCollisions = lasersCollisions[n];

        if (Math.round(scene.lasers[n].brightness) === 0) {
            laserCollisions = [];
        }

        for(let m = 0; m < laserCollisions.length; m++) {
            let laserCollision = laserCollisions[m];
            let row = newBody.insertRow(-1);
            let cell1 = row.insertCell(-1);
            cell1.innerText = (n + 1).toString();
            let cell2 = row.insertCell(-1);
            cell2.innerText = (m + 1).toString();
            let cell3 = row.insertCell(-1);
            cell3.innerText = laserCollision.type.charAt(0).toUpperCase() + laserCollision.type.slice(1);
            let cell4 = row.insertCell(-1);

            if (laserCollision.type !== "void") {
                cell4.innerText = "(" + (Math.round(10 * laserCollision.position.x) / 10).toString() + ", " + (Math.round(-10 * laserCollision.position.y) / 10).toString() + ")";
            } else {
                cell4.innerText = "-";
            }
            
            let cell5 = row.insertCell(-1);

            if (laserCollision.type === "reflection" || laserCollision.type === "refraction") {
                cell5.innerText = (Math.round(100 * laserCollision.incidentAngle * 180 / Math.PI) / 100).toString() + " deg";
            } else {
                cell5.innerText = "-";
            }

            let cell6 = row.insertCell(-1);

            if (laserCollision.type === "reflection") {
                cell6.innerText = (Math.round(100 * laserCollision.reflectedAngle * 180 / Math.PI) / 100).toString() + " deg";
            } else {
                cell6.innerText = "-";
            }

            let cell7 = row.insertCell(-1);
            let cell8 = row.insertCell(-1);
            let cell9 = row.insertCell(-1);
            let cell10 = row.insertCell(-1);
            let cell11 = row.insertCell(-1);

            if (laserCollision.type === "refraction") {
                cell7.innerText = (Math.round(100 * laserCollision.refractedAngle * 180 / Math.PI) / 100).toString() + " deg";
                cell8.innerText = (Math.round(100 * laserCollision.incidentIndex) / 100).toString();
                cell9.innerText = (Math.round(100 * laserCollision.refractedIndex) / 100).toString();
                cell10.innerText = laserCollision.incidentCount.toString();
                cell11.innerText = laserCollision.refractedCount.toString();
            } else {
                cell7.innerText = "-";
                cell8.innerText = "-";
                cell9.innerText = "-";
                cell10.innerText = "-";
                cell11.innerText = "-";
            }
        }
    }

    let oldBody = collisionTable.getElementsByTagName("tbody")[0];
    oldBody.parentNode.replaceChild(newBody, oldBody);
}

// register window mouse and key events as well as loading and window resize event
window.addEventListener("load", setup);
window.addEventListener("resize", resize);
window.addEventListener("mousedown", mousedown);
window.addEventListener("mouseup", mouseup);
window.addEventListener("mousemove", mousemove);
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);
window.addEventListener("touchstart", touchstart);
window.addEventListener("touchend", touchend);
window.addEventListener("touchmove", touchmove);

function setup(event = undefined) {
    loadExample(1);
    // render the first frame
    request = window.requestAnimationFrame(render);
    // resize the canvas onload
    resize();
}

/** function to reset the style width and height of the canvas */
function resize(event = undefined) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    // finding dimensions to maximize constrained viewing space
    if (windowWidth / windowHeight > 1920 / 1080) {
        canvas.style.width = `${(windowHeight / windowWidth) * (1920 / 1080) * 100}%`;
        canvas.style.height = "100%";
    } else {
        canvas.style.width = "100%";
        canvas.style.height = `${(windowWidth / windowHeight) * (1080 / 1920) * 100}%`;
    }
}

/**
 * function to register a mousedown event, sets the mouse button and action
 * and plays a sound and adds appropriate interferer if needed as well as fixing
 * the properties of the dragged object
 */
function mousedown(event) {
    // prevent registering mouse during wallpaper showing
    if (time < 90) {
        return;
    }

    if (mousePosition.x < -960 || mousePosition.y < -540 || mousePosition.x > 960 || mousePosition.y > 540) {
        return;
    }

    mousePressed = true;
    // check the left side of the canvas buttons to see where mouse was
    // clicked and set mouse action accordingly
    if (mousePosition.x + 960 > -10 && mousePosition.y > -310 && mousePosition.x + 960 < 150 && mousePosition.y < 230) {
        if (mousePosition.y < -225) {
            if (mousePosition.x + 960 < 70) {
                mouseAction = MouseAction.dragX;
            } else {
                mouseAction = MouseAction.dragY;
            }
        } else if (mousePosition.y < -75) {
            mouseAction = MouseAction.drag;
        } else if (mousePosition.y < 75) {
            mouseAction = MouseAction.rotate;
        } else {
            mouseAction = MouseAction.change;
        }

        if (touch === false) {
            switchSound.currentTime = 0;
            switchSound.play();
        }

        mobilePanning = false;
        return;
    }

    // do the same thing for the right side of the canvas buttons
    if (mousePosition.x + 960 > 1770 && mousePosition.y > -310 && mousePosition.x + 960 < 1930 && mousePosition.y < 150) {
        if (mousePosition.y < -155) {
            mouseAction = MouseAction.laser;
        } else if (mousePosition.y < -5) {
            mouseAction = MouseAction.interferer;
        } else {
            mouseAction = MouseAction.guide;
        }

        if (touch === false) {
            switchSound.currentTime = 0;
            switchSound.play();
        }

        mobilePanning = false;
        return;
    }

    if (mousePosition.x + 960 >= 0 && mousePosition.y + 540 >= 0 && mousePosition.x + 960 <= 1920 && mousePosition.y + 540 <= 1080) {
        mobilePanning = true;
    } else {
        mobilePanning = false;
    }

    // check whether to add a laser, interferer or guide tool to the scene
    if (mouseAction === MouseAction.laser) {
        let laser = new Laser(mousePosition.clone().addTo(cameraPosition), randomFloat(0, 2 * Math.PI));
        scene.addLaser(laser);
        laser.dragBrightness = 0.75;
        laser.dragOffset = new Point(0, 0);
        laser.dragPosition = laser.position.clone();
        laser.dragRotation = laser.rotation;
        laser.mousePositionOnDrag = mousePosition.clone();
        scene.draggedObject = laser;
        scene.draggedLaser = laser;
        mouseAction = MouseAction.rotate;
        return;
    } else if (mouseAction === MouseAction.interferer) {
        let mirror = new Mirror(Mirror.reflecting(), mousePosition.clone().addTo(cameraPosition), randomFloat(0, 2 * Math.PI));
        mirror.makeRegularPolygon(randomFloat(150, 200), randomInteger(3, 6));
        scene.addMirror(mirror);
        mirror.dragValue = mirror.indexOfRefraction;
        mirror.mousePositionOnDrag = mousePosition.clone();
        mirror.dragOffset = new Point(0, 0);
        mirror.dragPosition = mirror.position.clone();
        mirror.dragRotation = mirror.rotation;
        scene.draggedObject = mirror;
        scene.draggedMirror = mirror;
        mouseAction = MouseAction.change;
        return;
    } else if (mouseAction === MouseAction.guide) {
        let guide = undefined;

        // check whether to add a ruler or a protractor guide tool
        // while limiting maximum guides in the scene to 2
        if (scene.guides.length === 0) {
            guide = new Guide(mousePosition.clone().addTo(cameraPosition), 0);
        } else {
            if (scene.guides.length === 2) {
                scene.removeGuide(scene.guides[0]);
            }

            guide = new Guide(mousePosition.clone().addTo(cameraPosition), 0, modulus(scene.guides[0].guidance + 0.5, 1));
        }

        scene.addGuide(guide);

        guide.mousePositionOnDrag = mousePosition.clone();
        guide.dragGuidance = 0.25;
        guide.dragOffset = new Point(0, 0);
        guide.dragPosition = guide.position.clone();
        guide.dragRotation = guide.rotation;
        scene.draggedObject = guide;
        scene.draggedGuide = guide;
        mouseAction = MouseAction.rotate;
        return;
    }

    // some hacky shit
    let distanceRandomizer = function (distance) {
        return (distance + randomFloat(-50, 50));
    };

    let point = mousePosition.clone().addTo(cameraPosition);
    let closestLaser = Scene.getClosestObjectToPoint(point, scene.lasers.filter(function (z) {
        return z.interactive;
    }), distanceRandomizer);
    let laser = undefined;

    if (closestLaser !== false && closestLaser.distanceToObject <= 200) {
        laser = [closestLaser.object];
    } else {
        laser = [];
    }

    let closestGuide = Scene.getClosestObjectToPoint(point, scene.guides.filter(function (z) {
        return z.interactive;
    }), distanceRandomizer);
    let guide = undefined;

    if (closestGuide !== false && closestGuide.distanceToObject <= 300) {
        guide = [closestGuide.object];
    } else {
        guide = [];
    }

    let closest = Scene.getClosestObjectToPoint(point, scene.getMirrorsWithPointInside(point).filter(function (z) {
        return z.interactive;
    }).concat(laser, guide), distanceRandomizer);

    if (closest !== false) {
        let object = closest.object;
        scene.setDraggedObjectTo(object);
        object.dragOffset = point.subtractTo(object.position);
        object.mousePositionOnDrag = mousePosition.clone();
        object.dragPosition = object.position.clone();
        object.dragRotation = object.rotation;

        if (object instanceof Laser) {
            object.dragBrightness = object.brightness;
        } else if (object instanceof Mirror) {
            object.dragValue = object.indexOfRefraction;
        } else if (object instanceof Guide) {
            object.dragGuidance = object.guidance;
        }

        if (touch === false) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    } else {
        if (touch === false) {
            misclickSound.currentTime = 0;
            misclickSound.play();
        }
    }
}

/**
 * function to register a mouseup event, sets the mouse button
 * and plays a sound and fixes the scene
 */
function mouseup(event) {
    mousePressed = false;

    if (scene.draggedObject !== false && touch === false) {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    scene.setDraggedObjectTo(false);
}

/** function to register a mousemove event, sets the mouse position to coordinate values */
function mousemove(event) {
    let rect = canvas.getBoundingClientRect();
    let point = new Point(((event.clientX - rect.left) / (rect.right - rect.left) - 0.5), ((event.clientY - rect.top) / (rect.bottom - rect.top) - 0.5)).scaleXY(1920, 1080);
    point.x = clamp(point.x, -0.5 * DRAW_RANGE, 0.5 * DRAW_RANGE);
    point.y = clamp(point.y, -0.5 * DRAW_RANGE, 0.5 * DRAW_RANGE);
    mousePosition.setTo(point);
}

/**
 * function to register a keydown event, adds the event key
 * and checks the event key to determine how to change the scene
 */
function keydown(event) {
    const eventKey = event.key;

    if (keysPressed.includes(eventKey) === false) {
        keysPressed.push(eventKey);
    }

    if (!keysFired) {
        keysFired = true;

        if (eventKey.toUpperCase() === "T") {
            mouseAction = MouseAction.drag;
        } else if (eventKey.toUpperCase() === "X") {
            if (mouseAction === MouseAction.drag || mouseAction === MouseAction.dragY) {
                mouseAction = MouseAction.dragX;
            }
        } else if (eventKey.toUpperCase() === "Y") {
            if (mouseAction === MouseAction.drag || mouseAction === MouseAction.dragX) {
                mouseAction = MouseAction.dragY;
            }
        } else if (eventKey.toUpperCase() === "R") {
            mouseAction = MouseAction.rotate;
        } else if (eventKey.toUpperCase() === "C") {
            mouseAction = MouseAction.change;
        } else if (eventKey.toUpperCase() === "L") {
            mouseAction = MouseAction.laser;
        } else if (eventKey.toUpperCase() === "I") {
            mouseAction = MouseAction.interferer
        } else if (eventKey.toUpperCase() === "G") {
            mouseAction = MouseAction.guide;
        } else if (eventKey === "ArrowLeft") {
            event.preventDefault();
        } else if (eventKey === "ArrowRight") {
            event.preventDefault();
        } else if (eventKey === "ArrowUp") {
            event.preventDefault();
        } else if (eventKey === "ArrowDown") {
            event.preventDefault();
        } else if (eventKey === "Backspace" || eventKey === "Delete" || eventKey === "0") {
            loadExample(0);
        } else if (eventKey === "1") {
            loadExample(1);
        } else if (eventKey === "2") {
            loadExample(2);
        } else if (eventKey === "3") {
            loadExample(3);
        } else if (eventKey === "4") {
            loadExample(4);
        } else if (eventKey === "5") {
            loadExample(5);
        } else if (eventKey === "6") {
            loadExample(6);
        } else if (eventKey === "7") {
            loadExample(7);
        } else if (eventKey === "8") {
            loadExample(8);
        } else if (eventKey === "9") {
            loadExample(9);
        } else if (eventKey.toUpperCase() === "Z") {
            glow = !glow;
        }
    }
}

/** function to register a keyup event, removed the event key from the array */
function keyup(event) {
    const eventKey = event.key;
    keysPressed.splice(keysPressed.indexOf(eventKey), 1);
    keysFired = false;
}

/** function to register a mobile touchstart event, calls mousedown */
function touchstart(event) {
    touch = true;
    touchmove(event);
    mousedown({button: 0});
}

/** function to register a mobile touchend event, calls mouseup */
function touchend(event) {
    touch = true;
    mouseup({button: 0});
}

/** function to register a mobile touchmove event, calls mousemove */
function touchmove(event) {
    touch = true;
    for (let n = 0; n < event.touches.length; n++) {
        mousemove({clientX: event.touches[n].clientX, clientY: event.touches[n].clientY});
    }
}

/** function to get the amount of shadowBlur to be used for a glow effect */
function getGlowBlur(shadowBlur) {
    if (glow) {
        return shadowBlur;
    }

    return 0;
}

/** function to get the properties of objects as an array of properties */
function getPropertiesOfObjects(objects, property) {
    let properties = [];

    for (let n = 0; n < objects.length; n++) {
        properties.push(objects[n][property]);
    }

    return properties;
}

/** function to get the minimum of an array of numbers */
function minimum(values) {
    let min = values[0];

    for (let n = 1; n < values.length; n++) {
        let value = values[n];

        if (value < min) {
            min = value;
        }
    }

    return min;
}

/** function to get the maximum of an array of numbers */
function maximum(values) {
    let max = values[0];

    for (let n = 1; n < values.length; n++) {
        let value = values[n];

        if (value > max) {
            max = value;
        }
    }

    return max;
}

/** function to get the summation of an array of numbers */
function summation(values) {
    let sum = 0;

    for (let n = 0; n < values.length; n++) {
        sum += values[n];
    }

    return sum;
}

/** function to get the average of an array of numbers */
function average(values) {
    let avg = summation(values) / values.length;
    return avg;
}

/** function to get a random integer from a minimum to a maximum value */
function randomInteger(min = 0, max = 1) {
    return Math.floor(randomFloat(min, max + 1));
}

/** function to get a random float from a minimum to a maximum value */
function randomFloat(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

/** function to get the value of a number clamped to a minimum */
function clampMin(num, min) {
    return Math.max(num, min)
}

/** function to get the value of a number clamped to a maximum */
function clampMax(num, max) {
    return Math.min(num, max);
}

/** function to get the value of a number clamped to a minimum and maximum */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/** function to get the mapping value of a number from first space to the second space */
function map(value, start1, stop1, start2, stop2) {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

/** function to get the distance between two point objects */
function distance(p1, p2 = pointOrigin) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/** function to get the squared distance between two point objects */
function distanceSquared(p1, p2 = pointOrigin) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

/** function to get the manhattan distance between two point objects (sum of absolutes) */
function distanceManhattan(p1, p2 = pointOrigin) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

/** function to get the linearly interpolated value from a starting and ending value */
function interpolateLinear(startingValue, endingValue, t) {
    return (startingValue + (endingValue - startingValue) * t);
}

/** function to get the quadratically interpolated value from a starting and ending value */
function interpolateQuadratic(startingValue, endingValue, t) {
    return interpolateLinear(startingValue, endingValue, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
}

/** function to get an elastically interpolated value from a starting and ending value */
function interpolateElastic(startingValue, endingValue, t) {
    const c5 = (2 * Math.PI) / 4.5;
    return interpolateLinear(startingValue, endingValue, t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1);
}

/** function to get the minimum signed angle between two angles */
function calculateAngleDifference(a1, a2) {
    let difference = a2 - a1;
    while (difference < -Math.PI)
        difference += 2 * Math.PI;
    while (difference > Math.PI)
        difference -= 2 * Math.PI;
    return difference;
}

/** function to get whether two segments intersects using two line objects */
function intersectSegmentSegment(line1, line2) {
    return intersectionSegmentSegment(line1, line2) !== false;
}

/** function to get the intersection of two lines using two line objects */
function intersectionLineLine(line1, line2) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        return true;
    });
}

/** function to get the intersection of a line and segment using two line objects */
function intersectionLineSegment(line1, line2) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        if (ub < 0 || ub > 1) {
            return false;
        }

        return true;
    });
}

/** function to get the intersection of two segments using two line objects */
function intersectionSegmentSegment(line1, line2) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }

        return true;
    });
}

/** function to get the intersection of a segment and a ray using two line objects */
function intersectionSegmentRay(line1, line2) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        if (ua < 0 || ua > 1 || ub < 0) {
            return false;
        }

        return true;
    });
}

/**
 * generic function to get the intersection of two capped or uncapped lines
 * using an elimination function of two lines
 */
function intersectionStraightStraight(line1, line2, eliminationFunction) {
    if (line1.p1.matchesWith(line1.p2, 1e-9) || line2.p1.matchesWith(line2.p2, 1e-9)) {
        return false;
    }

    let denominator = line1.getProjectionOfCrossProductBetweenLine(line2);

    if (numberMatches(denominator, 0, 1e-9)) {
        return false;
    }

    let line = new Line(line1.p1, line2.p1);
    let ua = line.getProjectionOfCrossProductBetweenLine(line2) / denominator;
    let ub = line.getProjectionOfCrossProductBetweenLine(line1) / denominator;

    if (eliminationFunction(ua, ub) === false) {
        return false;
    }

    return line1.p1.clone().addTo(line1.p2.clone().subtractTo(line1.p1).multiplyBy(ua));
}

/** function to get the real modulus (working correctly with negative numbers) */
function modulus(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
}

/** function to check whether a number matches a reference within a certain threshold */
function numberMatches(num, ref, epsilon) {
    return (Math.abs(num - ref) <= epsilon);
}
