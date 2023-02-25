class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    isEqual(p) {
        return (this.x === p.x && this.y === p.y);
    }

    setTo(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }

    addTo(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    addToX(x) {
        this.x += x;
        return this;
    }

    addToY(y) {
        this.y += y;
        return this;
    }

    addToXY(x, y) {
        return this.addToX(x).addToY(y);
    }

    addToPolar(r, a) {
        this.x += r * Math.cos(a);
        this.y += r * Math.sin(a);
        return this;
    }

    subtractTo(p) {
        return this.addToXY(-p.x, -p.y);
    }

    subtractToX(x) {
        return this.addToX(-x);
    }

    subtractToY(y) {
        return this.addToY(-y);
    }

    subtractToXY(x, y) {
        return this.subtractToX(x).subtractToY(y);
    }

    multiplyBy(x) {
        return this.scaleXY(x);
    }

    divideBy(x) {
        return this.scaleXY(1 / x);
    }

    scale(p) {
        return this.scaleXY(p.x, p.y);
    }

    scaleX(x) {
        this.x *= x;
        return this;
    }

    scaleY(y) {
        this.y *= y;
        return this;
    }

    scaleXY(x, y = x) {
        return this.scaleX(x).scaleY(y);
    }

    rotateAroundPoint(p, rotation) {
        let cosine = Math.cos(rotation);
        let sine = Math.sin(rotation);
        let xD = this.x - p.x;
        let yD = this.y - p.y;
        this.x = cosine * xD - sine * yD + p.x;
        this.y = sine * xD + cosine * yD + p.y;
        return this;
    }

    absolute(x = true, y = true) {
        if (x) {
            this.x = Math.abs(x);
        }

        if (y) {
            this.y = Math.abs(y);
        }

        return this;
    }

    interpolateToPointLinear(p, t) {
        this.x = interpolateLinear(this.x, p.x, t);
        this.y = interpolateLinear(this.y, p.y, t);
        return this;
    }

    interpolateToPointQuadratic(p, t) {
        this.x = interpolateLinear(this.x, p.x, t);
        this.y = interpolateLinear(this.y, p.y, t);
        return this;
    }

    midPointTo(p) {
        this.x = (this.x + p.x) / 2;
        this.y = (this.y + p.y) / 2;
        return this;
    }

    getMagnitude() {
        return this.getDistanceTo();
    }

    getDistanceTo(p = pointOrigin) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        return this;
    }

    static fromRay(center, angle) {
        return new Line(center, center.clone().addToPolar(1, angle));
    }

    static fromPointSlope(point, slope) {
        return new Line(point, point.addTo(new Point(1, slope)));
    }

    clone() {
        return new Line(this.p1.clone(), this.p2.clone());
    }

    isEqual(l) {
        return (this.p1.isEqual(l.p1) && this.p2.isEqual(l.p2))
    }

    addTo(p) {
        this.p1.addTo(p);
        this.p2.addTo(p);
        return this;
    }

    subtractTo(p) {
        this.p1.subtractTo(p);
        this.p2.subtractTo(p);
        return this;
    }

    rotateAroundPoint(p, rotation) {
        this.p1.rotateAroundPoint(p, rotation);
        this.p2.rotateAroundPoint(p, rotation);
        return this;
    }

    getLength() {
        return distance(this.p1, this.p2);
    }

    getAngle() {
        let differencePoint = this.p1.clone().subtractTo(this.p2);
        return Math.atan2(differencePoint.y, differencePoint.x);
    }

    getDotProductBetweenLine(l) {
        let vector1 = this.p1.clone().subtractTo(this.p2);
        let vector2 = l.p1.clone().subtractTo(l.p2);
        let scalarProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        return scalarProduct;
    }

    getProjectionOfCrossProductBetweenLine(l) {
        let vector1 = this.p1.clone().subtractTo(this.p2);
        let vector2 = l.p1.clone().subtractTo(l.p2);
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }

    getAngleBetweenLine(l) {
        return Math.acos(this.getDotProductBetweenLine(l) / (this.getLength() * l.getLength()));
    }

    getAngleBetweenLinePerpendicular(l) {
        return Math.asin(this.getSineOfAngleBetweenLinePerpendicular(l));
    }

    getSineOfAngleBetweenLinePerpendicular(l) {
        return Math.abs(this.getDotProductBetweenLine(l)) / (this.getLength() * l.getLength());
    }

    getAngleReflected(angleOfIncidence) {
        return 2 * this.getAngle() - angleOfIncidence;
    }
}

class Polygon {
    constructor(vertices) {
        this.vertices = vertices;
    }

    set vertices(value) {
        delete this._leftVertex;
        delete this._rightVertex;
        delete this._topVertex;
        delete this._bottomVertex;
        this._vertices = value;
        this._sides = [];

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];

            if (this.leftVertex === undefined || vertex.x < this.leftVertex.x) {
                this._leftVertex = vertex;
            }

            if (this.rightVertex === undefined || vertex.x > this.rightVertex.x) {
                this._rightVertex = vertex;
            }

            if (this.topVertex === undefined || vertex.y < this.topVertex.y) {
                this._topVertex = vertex;
            }

            if (this.bottomVertex === undefined || vertex.y > this.bottomVertex.y) {
                this._bottomVertex = vertex;
            }

            let nextVertex = this.vertices[(n + 1) % this.vertices.length];
            this._sides.push(new Line(vertex, nextVertex));
        }
    }

    get vertices() {
        return this._vertices;
    }

    get sides() {
        return this._sides;
    }

    get leftVertex() {
        return this._leftVertex;
    }

    get rightVertex() {
        return this._rightVertex;
    }

    get topVertex() {
        return this._topVertex;
    }

    get bottomVertex() {
        return this._bottomVertex;
    }
}

class Object {
    constructor(position, rotation) {
        this.setPositionTo(position);
        this.setRotationTo(rotation);
        this.dragOffset;
        this.dragPosition;
        this.dragRotation;
        this.dragIndexOfRefraction;
        this.interactive = true;
        this.animate();
    }

    setPositionTo(position) {
        if (position instanceof Point) {
            this.position = position;
        } else if (position instanceof Animation) {
            this.positionAnimation = position;
        }

        return this;
    }

    setRotationTo(rotation) {
        if (rotation instanceof Animation) {
            this.rotationAnimation = rotation;
        } else {
            this.rotation = rotation;
        }

        return this;
    }

    animate() {
        if (this.hasOwnProperty("positionAnimation")) {
            let values = this.positionAnimation.getValues();
            this.position = new Point(values[0], values[1]);
            this.positionAnimation.animate();
        }

        if (this.hasOwnProperty("rotationAnimation")) {
            this.rotation = this.rotationAnimation.getValues();
            this.rotationAnimation.animate();
        }
    }
}

class Scene {
    constructor(objects = []) {
        this._lasers = [];
        this._mirrors = [];
        this._guides = [];
        this.draggedLaser = false;
        this.draggedMirror = false;
        this.draggedGuide = false;
        this.draggedObject = false;

        if (Array.isArray(objects)) {
            return this.addObjects(objects);
        }

        return this.addObject(objects);
    }

    set lasers(value) {
        this._lasers = value;

        if (this.draggedObject instanceof Laser) {
            let index = this._lasers.indexOf(this.draggedLaser);

            if (index === -1) {
                this.draggedLaser = false;
                this.draggedObject = false;
            }
        }
    }

    get lasers() {
        return this._lasers;
    }

    set mirrors(value) {
        this._mirrors = value;

        if (this.draggedObject instanceof Mirror) {
            let index = this._mirrors.indexOf(this.draggedMirror);

            if (index === -1) {
                this.draggedMirror = false;
                this.draggedObject = false;
            }
        }
    }

    get mirrors() {
        return this._mirrors;
    }

    get guides() {
        return this._guides;
    }

    set guides(value) {
        this._guides = value;

        if (this.draggedObject instanceof Guide) {
            let index = this._guides.indexOf(this.draggedGuide);

            if (index === -1) {
                this.draggedGuide = false;
                this.draggedObject = false;
            }
        }
    }

    reset() {
        this.lasers = [];
        this.mirrors = [];
        this.guides = [];
        this.draggedLaser = false;
        this.draggedMirror = false;
        this.draggedGuide = false;
        this.draggedObject = false;
    }

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

    addLaser(laser) {
        this.lasers.push(laser);
        return this;
    }

    removeLaser(laser) {
        this.lasers.splice(this.lasers.indexOf(laser), 1);
        return this;
    }

    addLasers(lasers) {
        this.lasers = this.lasers.concat(lasers);
        return this;
    }

    addMirror(mirror) {
        this.mirrors.push(mirror);
        return this;
    }

    removeMirror(mirror) {
        this.mirrors.splice(this.mirrors.indexOf(mirror), 1);
        return this;
    }

    addMirrors(mirrors) {
        this.mirrors = this.mirrors.concat(mirrors);
        return this;
    }

    addGuide(guide) {
        this.guides.push(guide);
        return this;
    }

    removeGuide(guide) {
        this.guides.splice(this.guides.indexOf(guide), 1);
        return this;
    }

    addGuides(guides) {
        this.guides = this.guides.concat(guides);
        return this;
    }

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

    addObjects(objects) {
        for (let n = 0; n < objects.length; n++) {
            this.addObject(objects[n]);
        }

        return this;
    }

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

    getClosestObjectToPoint(p = pointOrigin, objects = []) {
        let closestObject;
        let distanceToClosestObject;

        for (let n = 0; n < objects.length; n++) {
            let object = objects[n];
            let distanceToObject = distance(p, object.position);

            if (closestObject === undefined || distanceToObject < distanceToClosestObject) {
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

    getClosestMirrorToPoint(p = pointOrigin) {
        let closest = this.getClosestObjectToPoint(p, this.mirrors);
        return closest;
    }

    getReflectingMirrors() {
        let mirrors = [];

        for (let n = 0; n < this.mirrors.length; n++) {
            let mirror = this.mirrors[n];

            if (mirror.isReflecting) {
                mirrors.push(mirror);
            }
        }

        return mirrors;
    }

    laser(laser, insideMirrors = [], intersections = [], sideIgnore = null) {
        if (intersections.length === LASER_MAX_COLLISIONS) {
            return intersections;
        }

        let laserLine = Line.fromRay(laser.position, laser.rotation);
        let closestMirror;
        let closestIntersection;
        let distanceToClosestIntersection;
        let closestSide;

        for (let n = 0; n < this.mirrors.length; n++) {
            let mirror = this.mirrors[n];
            let lastVertex;

            if (mirror.closedShape || mirror.isRefracting) {
                lastVertex = mirror.vertices.length;
            } else {
                lastVertex = mirror.vertices.length - 1;
            }

            for (let m = 0; m < lastVertex; m++) {
                let side = mirror.getSide(m, true);

                if (sideIgnore !== null && side.isEqual(sideIgnore)) {
                    continue;
                }

                let intersection = intersectionSegmentRay(side, laserLine, false);

                if (intersection !== false) {
                    let distanceToIntersection = distance(laser.position, intersection);

                    if (closestIntersection === undefined || distanceToIntersection < distanceToClosestIntersection) {
                        closestMirror = mirror;
                        closestIntersection = intersection;
                        distanceToClosestIntersection = distanceToIntersection;
                        closestSide = side;
                    }
                }
            }
        }

        let newIntersections = [];

        for (let n = 0; n < intersections.length; n++) {
            newIntersections[n] = intersections[n].clone();
        }

        if (closestMirror === undefined) {
            newIntersections.push(laser.position.clone().addToPolar(LASER_RANGE, laser.rotation));
            return newIntersections;
        }

        newIntersections.push(closestIntersection);

        if (closestMirror.isReflecting) {
            return this.laser(new Laser(closestIntersection, closestSide.getAngleReflected(laser.rotation)), insideMirrors, newIntersections, closestSide);
        } else if (closestMirror.isRefracting) {
            let newInsideMirrors = [];

            for (let n = 0; n < insideMirrors.length; n++) {
                newInsideMirrors[n] = insideMirrors[n];
            }

            if (!newInsideMirrors.includes(closestMirror)) {
                newInsideMirrors.push(closestMirror);
            } else {
                newInsideMirrors.splice(newInsideMirrors.indexOf(closestMirror), 1);
            }

            let incidentIndex = 1;
            let refractedIndex = 1;

            if (insideMirrors.length > 0) {
                incidentIndex = average(getPropertiesOfObjects(insideMirrors, "indexOfRefraction"));
            }

            if (newInsideMirrors.length > 0) {
                refractedIndex = average(getPropertiesOfObjects(newInsideMirrors, "indexOfRefraction"));
            }

            let criticalAngle;
            let criticalAngleSine;

            if (incidentIndex > refractedIndex) {
                criticalAngleSine = refractedIndex / incidentIndex;
                criticalAngle = Math.asin(criticalAngleSine);
            } else {
                criticalAngle = Math.PI / 2;
                criticalAngleSine = 1;
            }

            let incidentAngleSine = laserLine.getSineOfAngleBetweenLinePerpendicular(closestSide);
            let incidentAngle = Math.asin(incidentAngleSine);

            if (incidentAngleSine >= criticalAngleSine) {
                newIntersections.push(closestIntersection);
                return newIntersections;
            } else {
                let refractedAngleSine = incidentAngleSine * incidentIndex / refractedIndex;
                let refractedAngle = Math.asin(refractedAngleSine);
                return this.laser(new Laser(closestIntersection, laser.rotation - Math.sign(laserLine.getDotProductBetweenLine(closestSide)) * Math.sign(laserLine.getProjectionOfCrossProductBetweenLine(closestSide)) * (incidentAngle - refractedAngle)), newInsideMirrors, newIntersections, closestSide);
            }
        } else if (closestMirror.isAbsorbing) {
            return newIntersections;
        }
    }

    getLaserCollisions() {
        let lasersData = [];

        for (let n = 0; n < this.lasers.length; n++) {
            let laser = this.lasers[n];
            lasersData.push(this.laser(laser, this.getMirrorsWithPointInside(laser.position).filter(function (mirror) {
                return mirror.isRefracting;
            })));
        }

        return lasersData;
    }

    animate() {
        for (let n = 0; n < this.lasers.length; n++) {
            this.lasers[n].animate();
        }

        for (let n = 0; n < this.mirrors.length; n++) {
            this.mirrors[n].animate();
        }
    }
}

class Laser extends Object {
    constructor(position, rotation, brightness = 0.75) {
        super(position, rotation);
        this.brightness = brightness;
        return this;
    }
}

class Mirror extends Object {
    constructor(indexOfRefraction, position, rotation, vertices = [], closedShape = true) {
        super(position, rotation);
        this.indexOfRefraction = indexOfRefraction;
        this.vertices = vertices;
        this.closedShape = closedShape;
        return this;
    }

    static get refracting() {
        return 1.5;
    }

    static get reflecting() {
        return 0.5;
    }

    static get absorbing() {
        return -0.5;
    }

    get isRefracting() {
        return this.indexOfRefraction >= 1;
    }

    get isReflecting() {
        return this.indexOfRefraction < 1 && this.indexOfRefraction >= 0;
    }

    get isAbsorbing() {
        return this.indexOfRefraction < 0;
    }

    get isNotAbsorbing() {
        return !this.isAbsorbing;
    }

    getVertex(vertexNumber, absolute = false) {
        let correctedVertexNumber = vertexNumber;

        while (correctedVertexNumber < 0) {
            correctedVertexNumber += this.vertices.length;
        }

        let vertex = this.vertices[correctedVertexNumber % this.vertices.length];

        if (absolute) {
            vertex = vertex.clone().rotateAroundPoint(pointOrigin, this.rotation).addTo(this.position);
        }

        return vertex;
    }

    getSide(sideNumber, absolute = false) {
        return new Line(this.getVertex(sideNumber, absolute), this.getVertex(sideNumber + 1, absolute));
    }

    getExtremes(absolute = false) {
        if (this.vertices.length === 0) {
            return false;
        }

        let leftMost;
        let rightMost;
        let upMost;
        let downMost;

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

    pointInside(p, absolute) {
        let pointOutside = this.getExtremes(absolute).leftMost.clone().subtractTo(new Point(1, 0));
        let lineFromInsideToOutside = new Line(p, pointOutside);
        let sum = 0;

        for (let n = 0; n < this.vertices.length; n++) {
            let side = this.getSide(n, absolute);

            if (intersectSegmentSegment(lineFromInsideToOutside, side, false)) {
                sum++;
            }
        }

        return sum % 2 !== 0;
    }

    findArea() {
        if (this.vertices.length < 3) {
            return 0;
        }

        let sum = 0;

        for (let n = 1; n <= this.vertices.length; n++) {
            sum += this.getVertex(n).x * this.getVertex(n + 1).y - this.getVertex(n + 1).x * this.getVertex(n).y;
        }

        return sum;
    }

    findCenter() {
        let average = pointOrigin.clone();

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            average.addTo(vertex);
        }

        average.divideBy(this.vertices.length);

        return average;
    }

    moveAnchorTo(p) {
        this.translateVertices(this.position.clone().subtractTo(p));
        this.position.setTo(p);
    }

    translateVertices(p) {
        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.addTo(p);
        }
    }

    scaleVertices(xs, ys = xs) {
        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.scaleXY(xs, ys);
        }
    }

    subdivideVertices(vertexMultiplier = 2) {
        for (let n = 0; n < this.vertices.length; n++) {
            let side = this.getSide(n);
            let interpolations = [];

            for (let m = 1; m < vertexMultiplier; m++) {
                this.vertices.splice(n + 1, 0, side.p1.clone().interpolateToPointLinear(side.p2, m / (vertexMultiplier + 1)));
                n++;
            }
        }
    }

    smoothVertices(factor = 0.5, iterationsMultiplier = 1) {
        if (this.vertices.length === 0) {
            return;
        }

        let initialArea = this.findArea();

        for (let n = 0; n < Math.round(this.vertices.length * iterationsMultiplier); n++) {
            let previousVertex = this.getVertex(n - 1);
            let vertex = this.getVertex(n);
            let nextVertex = this.getVertex(n + 1);
            let midPoint = previousVertex.clone().midPointTo(nextVertex);
            vertex.interpolateToPointLinear(midPoint, factor);
        }

        let finalArea = this.findArea();
        this.scaleVertices(Math.sqrt(initialArea / finalArea));
    }

    makeRectangle(width, height) {
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        let topLeftCorner = new Point(-halfWidth, -halfHeight);
        let topRightCorner = new Point(halfWidth, -halfHeight);
        let bottomRightCorner = new Point(halfWidth, halfHeight);
        let bottomLeftCorner = new Point(-halfWidth, halfHeight);
        this.vertices = [topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner];
        this.closedShape = true;
    }

    makeCircle(radius, vertexCount) {
        this.vertices = [];

        for (let n = 0; n < vertexCount; n++) {
            let vertex = new Point();
            vertex.addToPolar(radius, n / vertexCount * 2 * Math.PI);
            this.vertices.push(vertex);
        }

        this.closedShape = true;
    }

    makeRegularPolygon(radius, sideCount) {
        this.vertices = [];

        for (let n = 0; n < sideCount; n++) {
            let angle = n / sideCount * 2 * Math.PI;
            this.vertices.push(new Point(radius * Math.cos(angle), radius * Math.sin(angle)));
        }

        this.closedShape = true;
    }

    makeConcaveMirror(focalLength, length, vertexCount) {
        this.vertices = [new Point(100, length / 2), new Point(100, -length / 2)];

        for (let n = 0; n < vertexCount; n++) {
            let x = (n / (vertexCount - 1) - 0.5) * length;
            this.vertices.push(new Point(Math.pow(x, 2) / (4 * focalLength), x));
        }

        this.closedShape = true;
    }

    makeConvexMirror(focalLength, length, vertexCount) {
        this.makeConcaveMirror(focalLength, length, vertexCount);
        this.vertices.shift();
        this.vertices.shift();
        let rightMost = this.getExtremes().rightMost;

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.x = -(vertex.x + rightMost.x) - rightMost.x;
        }

        this.closedShape = true;
    }

    makeConcaveLens(focalLength, length, vertexCount) {
        this.makeConvexMirror(focalLength, length, vertexCount);
        let rightMost = this.getExtremes().leftMost;

        for (let n = 0; n < this.vertices.length; n++) {
            let vertex = this.vertices[n];
            vertex.x += length / 60;
        }

        for (let n = this.vertices.length - 2; n >= 1; n--) {
            let vertex = this.vertices[n];
            this.vertices.push(new Point(-(vertex.x + rightMost.x) - rightMost.x - length / 60, vertex.y));
        }

        this.closedShape = true;
    }

    makeConvexLens(focalLength, length, vertexCount) {
        this.makeConvexMirror(focalLength, length, vertexCount);
        let rightMost = this.getExtremes().rightMost;

        for (let n = this.vertices.length - 2; n >= 1; n--) {
            let vertex = this.vertices[n];
            this.vertices.push(new Point(-(vertex.x - rightMost.x) + rightMost.x, vertex.y));
        }

        this.closedShape = true;
    }

    makeBlob(averageRadius, maxRadiusDeviation, maxAngleDeviation, vertexCount) {
        // 0 > maxAngleDeviation < 1
        this.vertices = [];

        for (let n = 0; n < vertexCount; n++) {
            let radius = clampMin(averageRadius + maxRadiusDeviation * averageRadius * 2 * (Math.random() - 0.5), -1);
            let angle = (n + maxAngleDeviation * 2 * (Math.random() - 0.5)) / vertexCount * 2 * Math.PI;
            this.vertices.push(new Point(radius * Math.cos(angle), radius * Math.sin(angle)));
        }

        this.closedShape = true;
    }
}

class Guide extends Object {
    constructor(position, rotation, guidance = 0.25) {
        super(position, rotation);
        this.guidance = guidance;
        return this;
    }
}

class MouseAction {
    static get drag() {
        return 0;
    }

    static get dragX() {
        return 1;
    }

    static get dragY() {
        return 2;
    }

    static get rotate() {
        return 3;
    }

    static get change() {
        return 4;
    }

    static get laser() {
        return 5;
    }

    static get interferer() {
        return 6;
    }

    static get guide() {
        return 7;
    }
}

class Animation {
    constructor(keyframes, interpolationFunction, duration, isLooping = true) {
        this.time = 0;
        this.keyframes = keyframes;
        this.interpolationFunction = interpolationFunction;
        this.duration = duration;
        this.isLooping = isLooping;
        return this;
    }

    getValues() {
        let lowKeyframe;

        for (let n = 0; n < this.keyframes.length; n++) {
            let keyframe = this.keyframes[n];
            if ((lowKeyframe === undefined || keyframe.time >= lowKeyframe.time) && keyframe.time <= this.time) {
                lowKeyframe = keyframe;
            }
        }

        let highKeyframe;

        for (let n = 0; n < this.keyframes.length; n++) {
            let keyframe = this.keyframes[n];
            if ((highKeyframe === undefined || keyframe.time <= highKeyframe.time) && keyframe.time >= this.time) {
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

        let mapped = map(this.time, lowKeyframe.time, highKeyframe.time, 0, 1);

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

    animate() {
        this.time++;

        if (this.isLooping) {
            while (this.time >= this.duration) {
                this.time -= this.duration;
            }
        }
    }
}

class Keyframe {
    constructor(time, values) {
        this.time = time;
        this.values = values;
        return this;
    }
}

let request;
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {alpha: false});
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
const mousePosition = pointOrigin.clone();
const mouseButtons = [false, false, false];
let mouseAction = MouseAction.drag;
const keysPressed = [];
let keysFired = false;
let keysHelp = 0
const LASER_MAX_COLLISIONS = 50;
const LASER_RANGE = 10000;
const scene = new Scene();
let time = 0;
loadExample(1);

function render() {
    if (scene.draggedObject !== false) {
        if (mouseAction === MouseAction.drag) {
            scene.draggedObject.position.setTo(mousePosition).addTo(cameraPosition).subtractTo(scene.draggedObject.dragOffset);
        } else if (mouseAction === MouseAction.dragX) {
            scene.draggedObject.position.x = mousePosition.x + cameraPosition.x - scene.draggedObject.dragOffset.x;
        } else if (mouseAction === MouseAction.dragY) {
            scene.draggedObject.position.y = mousePosition.y + cameraPosition.y - scene.draggedObject.dragOffset.y;
        } else if (mouseAction === MouseAction.rotate) {
            let line = new Line(scene.draggedObject.position.clone().subtractTo(cameraPosition), mousePosition);
            scene.draggedObject.rotation = modulus(line.getAngle(), 2 * Math.PI);
        } else if (mouseAction === MouseAction.change) {
            if (scene.draggedObject instanceof Mirror) {
                scene.draggedMirror.indexOfRefraction = clampMin(scene.draggedMirror.dragIndexOfRefraction + (scene.draggedMirror.mousePositionOnDrag.y - mousePosition.y) / 100, -2);
            } else if (scene.draggedObject instanceof Laser) {
                scene.draggedLaser.brightness = map(Math.round(modulus(scene.draggedLaser.dragBrightness + (scene.draggedLaser.mousePositionOnDrag.y - mousePosition.y) / 300, 1)), 0, 1, 0.25, 0.75);
            } else if (scene.draggedObject instanceof Guide) {
                scene.draggedGuide.guidance = map(Math.round(modulus(scene.draggedGuide.dragGuidance + (scene.draggedGuide.mousePositionOnDrag.y - mousePosition.y) / 300, 1)), 0, 1, 0.25, 0.75);
            }
        }
    }

    scene.animate();

    if (keysPressed.includes("ArrowLeft") || keysPressed.includes("a") || keysPressed.includes("A")) {
        cameraPosition.x -= 10;
    }

    if (keysPressed.includes("ArrowRight") || keysPressed.includes("d") || keysPressed.includes("D")) {
        cameraPosition.x += 10;
    }

    if (keysPressed.includes("ArrowUp") || keysPressed.includes("w") || keysPressed.includes("W")) {
        cameraPosition.y -= 10;
    }

    if (keysPressed.includes("ArrowDown") || keysPressed.includes("s") || keysPressed.includes("S")) {
        cameraPosition.y += 10;
    }

    let lasersCollisions = scene.getLaserCollisions();

    if (scene.draggedGuide !== false && mouseAction === MouseAction.drag && scene.draggedObject instanceof Guide && Math.round(scene.draggedObject.guidance) === 1) {
        let objects = [];
        for (let n = 0; n < lasersCollisions.length; n++) {
            objects.push({position: scene.lasers[n].position});
            let laserCollisions = lasersCollisions[n];

            for (let m = 0; m < laserCollisions.length; m++) {
                let laserCollision = laserCollisions[m];
                objects.push({position: laserCollision});
            }
        }

        let closest = scene.getClosestObjectToPoint(scene.draggedObject.position, objects);

        if (closest !== false && closest.distanceToObject <= 50) {
            scene.draggedObject.position.setTo(closest.object.position);
        }
    }

    ctx.translate(960 - cameraPosition.x, 540 - cameraPosition.y);
    ctx.fillStyle = ctx.createPattern(tileImage, "repeat");
    ctx.shadowBlur = 0;
    ctx.fillRect(cameraPosition.x - 960, cameraPosition.y - 540, 1920, 1080);

    for (let n = 0; n < scene.guides.length; n++) {
        let guide = scene.guides[n];

        if (scene.draggedObject === false || !scene.draggedObject instanceof Guide || scene.draggedObject !== guide) {
            ctx.globalAlpha = 0.5;
        }

        ctx.save();
        ctx.translate(guide.position.x, guide.position.y);
        ctx.rotate(guide.rotation);

        if (Math.round(guide.guidance) === 0) {
            ctx.rotate(Math.PI / 2)
            ctx.drawImage(rulerImage, -400, -57.5, 800, 115);
        } else {
            ctx.drawImage(protractorImage, -300, -300, 600, 600);
        }

        ctx.restore();
        ctx.globalAlpha = 1;
    }

    ctx.lineWidth = 5;
    ctx.lineJoin = "round";

    let mirrors = scene.mirrors;

    for (let n = 0; n < 3; n++) {
        let selectedMirrors;

        if (n === 0) {
            selectedMirrors = mirrors.filter(function (mirror) {
                return !mirror.isNotAbsorbing;
            });

            ctx.strokeStyle = "#ffffff";
        } else {
            if (n === 1) {
                selectedMirrors = mirrors.filter(function (mirror) {
                    return mirror.isNotAbsorbing;
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

        for (let m = 0; m < selectedMirrors.length; m++) {
            let mirror = selectedMirrors[m];
            let vertices = mirror.vertices;
            ctx.save();
            ctx.translate(mirror.position.x, mirror.position.y);
            ctx.rotate(mirror.rotation);
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);

            for (let v = 1; v < vertices.length; v++) {
                let vertex = vertices[v];
                ctx.lineTo(vertex.x, vertex.y);
            }

            if (mirror.closedShape || mirror.isRefracting) {
                ctx.closePath();
            }

            ctx.stroke();

            if (mirror.isRefracting) {
                ctx.globalAlpha = clamp(1 - 1 / Math.pow(Math.E, 0.1 * (mirror.indexOfRefraction - 1)), 0, 1);
                ctx.shadowBlur = 0;
                ctx.fill();
            }
            ctx.restore();
        }
    }

    ctx.lineWidth = 3;

    for (let n = 0; n < lasersCollisions.length; n++) {
        let laser = scene.lasers[n];
        let laserCollisions = lasersCollisions[n];

        if (Math.round(laser.brightness) !== 0) {
            ctx.strokeStyle = "hsl(120, 100%, 50%)";
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = getGlowBlur(20);
            ctx.globalAlpha = clamp(Math.round(laser.brightness), 0, 1);
            ctx.beginPath();
            ctx.moveTo(laser.position.x, laser.position.y);

            for (let m = 0; m < laserCollisions.length; m++) {
                let laserCollision = laserCollisions[m];
                ctx.lineTo(laserCollision.x, laserCollision.y);
            }

            ctx.stroke();
        }
    }

    for (let l = 0; l < scene.lasers.length; l++) {
        let laser = scene.lasers[l];
        ctx.globalAlpha = 1;

        if (scene.draggedObject === laser) {
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = getGlowBlur(30);
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.save();
        ctx.translate(laser.position.x, laser.position.y);
        ctx.rotate(laser.rotation);
        ctx.drawImage(laserImage, -204.3, -18.7, 204.3, 37.3);
        ctx.restore();
    }

    if (scene.draggedObject !== false) {
        let text;
        let doDrawText = true;

        if (mouseAction === MouseAction.dragX) {
            text = "x: " + Math.round(scene.draggedObject.position.x);
        }

        if (mouseAction === MouseAction.dragY) {
            text = "y: " + Math.round(-scene.draggedObject.position.y);
        }

        if (mouseAction === MouseAction.drag) {
            text = "x: " + Math.round(scene.draggedObject.position.x) + ", y: " + Math.round(-scene.draggedObject.position.y);
        }

        if (mouseAction === MouseAction.rotate) {
            text = "r: " + Math.floor((2 * Math.PI - scene.draggedObject.rotation) * 180 / Math.PI) + " deg";
        }

        if (mouseAction === MouseAction.change) {
            if (scene.draggedObject instanceof Laser) {
                if (Math.round(scene.draggedLaser.brightness) === 1) {
                    text = "Laser: ON";
                } else {
                    text = "Laser: OFF";
                }
            } else if (scene.draggedObject instanceof Mirror) {
                if (scene.draggedMirror.isRefracting) {
                    text = "Refractive, IOR: " + Math.round(100 * scene.draggedObject.indexOfRefraction) / 100;
                }

                if (scene.draggedMirror.isReflecting) {
                    text = "Reflective";
                }

                if (scene.draggedMirror.isAbsorbing) {
                    text = "Absorbtive";
                }
            }

            if (scene.draggedObject instanceof Guide) {
                if (Math.round(scene.draggedGuide.guidance) === 0) {
                    text = "Ruler";
                } else {
                    text = "Protractor";
                }
            }
        }

        if (doDrawText) {
            let extraSpace = 0;

            if (scene.draggedObject instanceof Laser) {
                if (scene.draggedLaser.rotation < Math.PI) {
                    extraSpace = -70;
                } else {
                    extraSpace = 70;
                }
            } else if (scene.draggedObject instanceof Guide && Math.round(scene.draggedObject.guidance) === 1) {
                extraSpace = 100;
            }

            let textWidth = ctx.measureText(text).width;

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#000000";
            ctx.fillRect(scene.draggedObject.position.x - textWidth / 2 - 5, scene.draggedObject.position.y - 25 - 5 + extraSpace, textWidth + 10, 50 + 10);

            ctx.fillStyle = "#ffffff";
            ctx.font = "50px Verdana";
            ctx.fillText(text, scene.draggedObject.position.x - textWidth / 2, scene.draggedObject.position.y + 25 + extraSpace);
        }
    }

    ctx.resetTransform();

    ctx.shadowBlur = 0;
    ctx.translate(0, 540);

    ctx.fillStyle = "#222222";
    ctx.fillRect(-10, -310, 160, 540);
    ctx.fillRect(1770, -310, 160, 460);

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

    if ((distance(new Point(mousePosition.x + 960, mousePosition.y), new Point(0, 0)) < 500 || distance(new Point(mousePosition.x + 960, mousePosition.y), new Point(1920, 0)) < 500) && scene.draggedObject === false) {
        keysHelp = clampMin(keysHelp - 0.05, 0);
    } else {
        keysHelp = clampMax(keysHelp + 0.05, 1);
    }

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

    if (keysHelp < 0.99) {
        ctx.globalAlpha = clamp(1 - keysHelp, 0, 1);
        ctx.drawImage(dragXImage, 17, -283, 36, 36);
        ctx.drawImage(dragYImage, 90, -283, 36, 36);
        ctx.drawImage(dragImage, 34, -186, 72, 72);
        ctx.drawImage(rotateImage, 34, -36, 72, 72);
        ctx.drawImage(changeImage, 34, 114, 72, 72);
        ctx.drawImage(addLaserImage, 1814, -266, 72, 72);
        ctx.drawImage(addInterfererImage, 1814, -116, 72, 72);

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
    ctx.resetTransform();

    if (time < 120) {
        if (time < 60) {
            ctx.globalAlpha = 1;
        } else {
            ctx.globalAlpha = clamp(map(time, 60, 120, 1, 0), 0, 1);
        }

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 1920, 1080)
        ctx.drawImage(wallpaperImage, 0, 0);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#000000";

    ctx.save();
    ctx.translate(mousePosition.x + 960, mousePosition.y + 540);

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

    ctx.restore();
    time += 1;
    request = requestAnimationFrame(render);
}

function loadExample(n) {
    scene.reset();
    cameraPosition.setTo(pointOrigin);

    switch (n) {
        case 1:
            scene.lasers.push(new Laser(new Point(100, -250), Math.PI / 4));
            let triangle = new Mirror(Mirror.absorbing, new Point(-300, 375), 0)
            triangle.makeRegularPolygon(150, 3);
            triangle.setRotationTo(Math.PI / 10);
            let square = new Mirror(Mirror.absorbing, new Point(595, -275), Math.PI / 4)
            square.makeRectangle(400, 400);
            square.setRotationTo(Math.PI / 4);
            let rectangle = new Mirror(Mirror.reflecting, new Point(-600, -100), Math.PI / 10)
            rectangle.makeRectangle(40, 400);
            rectangle.setRotationTo(Math.PI / 10);
            let polygon = new Mirror(Mirror.absorbing, new Point(600, 400), 0);
            polygon.makeRegularPolygon(150, 5);
            let circle = new Mirror(3, new Point(100, 50), 0);
            circle.makeCircle(150, 500);
            scene.mirrors.push(triangle, square, rectangle, polygon, circle);
            break;
        case 2:
            scene.lasers.push(new Laser(new Point(-150, -200), Math.PI / 10));
            scene.mirrors = [];

            for (let x = -2; x <= 2; x++) {
                for (let y = -1; y <= 1; y++) {
                    let position = new Point(300 * x, 300 * y);
                    let square = new Mirror(3, new Animation([new Keyframe(0, [position.x, position.y]), new Keyframe(90 + 20 * Math.random(), [position.x + 40 + 20 * Math.random(), position.y + 40 + 20 * Math.random()]), new Keyframe(200, [position.x, position.y])], interpolateElastic, 200), new Animation([new Keyframe(0, 0), new Keyframe(20, Math.PI / 100), new Keyframe(40, 0)], interpolateLinear, 40));
                    square.makeRectangle(150, 150);
                    scene.mirrors.push(square);
                }
            }
            break;
        case 3:
            scene.lasers = [new Laser(new Point(-700, -300), Math.PI / 10)];
            let blob = new Mirror(Mirror.reflecting, new Point(0, 0), new Animation([new Keyframe(0, 0), new Keyframe(2500, 7 * Math.PI)], interpolateLinear, 2500));
            blob.makeBlob(300, 0.5, 0.5, 100);
            blob.smoothVertices(0.5, 10);
            scene.mirrors = [blob];
            break;
        case 4:
            scene.lasers = [
                new Laser(new Point(-100, -200), 0),
                new Laser(new Point(-100, -100), 0),
                new Laser(new Point(-100, -0), 0),
                new Laser(new Point(-100, 100), 0),
                new Laser(new Point(-100, 200), 0),
            ];
            let parabola = new Mirror(Mirror.reflecting, new Point(300, 0), 0);
            parabola.makeConcaveLens(-200, 600, 100);
            parabola.closedShape = true;
            scene.mirrors = [parabola];
            break;
        case 5:
            scene.lasers = [new Laser(new Point(700, 0), 1 * Math.PI, 1)];
            scene.mirrors = [
                new Mirror(Mirror.absorbing, new Point(0, 0), 0),
                new Mirror(Mirror.reflecting, new Point(350, 300), 1.2 * Math.PI),
                new Mirror(Mirror.reflecting, new Point(-300, -400), 1.9 * Math.PI),
                new Mirror(Mirror.reflecting, new Point(400, -300), 1.1 * Math.PI),
                new Mirror(Mirror.reflecting, new Point(0, 0), 0.7 * Math.PI),
                new Mirror(Mirror.reflecting, new Point(-500, 300), 0.3 * Math.PI),
            ];
            scene.mirrors[0].makeRectangle(1500, 1000);
            scene.mirrors[0].interactive = false;
            scene.mirrors[1].makeRectangle(300, 50);
            scene.mirrors[2].makeRectangle(300, 50);
            scene.mirrors[3].makeRectangle(300, 50);
            scene.mirrors[4].makeRectangle(300, 50);
            scene.mirrors[5].makeRectangle(300, 50);
    }
}

canvas.onmousedown = mousedown;
canvas.onmouseup = mouseup;
window.onresize = resize;
window.onmousemove = mousemove;
window.onkeydown = keydown;
window.onkeyup = keyup;
window.onload = function () {
    request = requestAnimationFrame(render);
}
window.oncontextmenu = function (event) {
    event.preventDefault();
};
resize();

function resize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if (windowWidth / windowHeight > 1920 / 1080) {
        canvas.style.width = `${(windowHeight / windowWidth) * (1920 / 1080) * 100}%`;
        canvas.style.height = "100%";
    } else {
        canvas.style.width = "100%";
        canvas.style.height = `${(windowWidth / windowHeight) * (1080 / 1920) * 100}%`;
    }
}

function mousedown(event) {
    if (!event) {
        event = window.event;
    }

    if (time < 90) {
        return;
    }

    mouseButtons[event.button] = true;

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

        switchSound.play();
        return;
    }

    if (mousePosition.x + 960 > 1770 && mousePosition.y > -310 && mousePosition.x + 960 < 1930 && mousePosition.y < 150) {
        if (mousePosition.y < -155) {
            mouseAction = MouseAction.laser;
        } else if (mousePosition.y < -5) {
            mouseAction = MouseAction.interferer;
        } else {
            mouseAction = MouseAction.guide;
        }

        switchSound.play();
        return;
    }

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
        let mirror = new Mirror(Mirror.reflecting, mousePosition.clone().addTo(cameraPosition), randomFloat(0, 2 * Math.PI));
        mirror.makeRegularPolygon(randomFloat(150, 200), randomInteger(3, 6));
        scene.addMirror(mirror);
        mirror.dragIndexOfRefraction = mirror.indexOfRefraction;
        mirror.mousePositionOnDrag = mousePosition.clone();
        mirror.dragOffset = new Point(0, 0);
        mirror.dragPosition = mirror.position.clone();
        mirror.dragRotation = mirror.rotation;
        scene.draggedObject = mirror;
        scene.draggedMirror = mirror;
        mouseAction = MouseAction.change;
        return;
    } else if (mouseAction === MouseAction.guide) {
        let guide;

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

    let point = mousePosition.clone().addTo(cameraPosition);
    let closestLaser = scene.getClosestObjectToPoint(point, scene.lasers.filter(function (z) {
        return z.interactive;
    }));
    let laser;

    if (closestLaser !== false && closestLaser.distanceToObject <= 200) {
        laser = [closestLaser.object];
    } else {
        laser = [];
    }

    let closestGuide = scene.getClosestObjectToPoint(point, scene.guides.filter(function (z) {
        return z.interactive;
    }));
    let guide;

    if (closestGuide !== false && closestGuide.distanceToObject <= 300) {
        guide = [closestGuide.object];
    } else {
        guide = [];
    }

    let closest = scene.getClosestObjectToPoint(point, scene.getMirrorsWithPointInside(point).filter(function (z) {
        return z.interactive;
    }).concat(laser, guide));

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
            object.dragIndexOfRefraction = object.indexOfRefraction;
        } else if (object instanceof Guide) {
            object.dragGuidance = object.guidance;
        }

        clickSound.play();
    } else {
        misclickSound.play();
    }
}

function mouseup(event) {
    if (!event) {
        event = window.event;
    }

    mouseButtons[event.button] = false;

    if (scene.draggedObject !== false) {
        clickSound.play();
    }

    scene.setDraggedObjectTo(false);
}

function mousemove(event) {
    if (!event) {
        event = window.event;
    }

    let rect = canvas.getBoundingClientRect();
    mousePosition.setTo(new Point(((event.clientX - rect.left) / (rect.right - rect.left) - 0.5) * 1920, ((event.clientY - rect.top) / (rect.bottom - rect.top) - 0.5) * 1080));
}

function keydown(event) {
    if (!event) {
        event = window.event;
    }

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
        } else if (eventKey === "Backspace" || eventKey === "Delete") {
            scene.reset();
        } else if (eventKey.toUpperCase() === "Z") {
            glow = !glow;
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
        }
    }
}

function keyup(event) {
    if (!event) {
        event = window.event;
    }

    const eventKey = event.key;

    keysPressed.splice(keysPressed.indexOf(eventKey), 1);
    keysFired = false;
}

function getGlowBlur(shadowBlur) {
    if (glow) {
        return shadowBlur;
    }

    return 0;
}

function getPropertiesOfObjects(objects, property) {
    let properties = [];

    for (let n = 0; n < objects.length; n++) {
        properties.push(objects[n][property]);
    }

    return properties;
}

function minimum(values) {
    let min;

    for (let n = 0; n < values.length; n++) {
        let value = values[n];

        if (min === undefined || value < min) {
            min = value;
        }
    }

    return min;
}

function maximum(values) {
    let max;

    for (let n = 0; n < values.length; n++) {
        let value = values[n];

        if (max === undefined || value > max) {
            max = value;
        }
    }

    return max;
}

function average(values) {
    let sum = 0;

    for (let n = 0; n < values.length; n++) {
        sum += values[n];
    }

    return sum / values.length;
}

function randomInteger(min = 0, max = 1) {
    return Math.floor(randomFloat(min, max + 1));
}

function randomFloat(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

function clampMin(num, min) {
    return Math.max(num, min)
}

function clampMax(num, max) {
    return Math.min(num, max);
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function map(value, start1, stop1, start2, stop2) {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function distance(p1, p2 = pointOrigin) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function distanceSquared(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function distanceManhattan(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function interpolateLinear(startingValue, endingValue, t) {
    return (startingValue + (endingValue - startingValue) * t);
}

function interpolateQuadratic(startingValue, endingValue, t) {
    return interpolateLinear(startingValue, endingValue, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
}

function interpolateElastic(startingValue, endingValue, t) {
    const c5 = (2 * Math.PI) / 4.5;
    return interpolateLinear(startingValue, endingValue, t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1);
}

function calculateAngleDifference(a1, a2) {
    let difference = a2 - a1;
    while (difference < -Math.PI)
        difference += 2 * Math.PI;
    while (difference > Math.PI)
        difference -= 2 * Math.PI;
    return difference;
}

function intersectSegmentSegment(line1, line2, line1p1inclusive = true, line1p2inclusive = true, line2p1inclusive = true, line2p2inclusive = true) {
    return intersectionSegmentSegment(line1, line2, line1p1inclusive, line1p2inclusive, line2p1inclusive, line2p2inclusive) !== false;
}

function intersectionLineLine(line1, line2) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        return true;
    });
}

function intersectionLineSegment(line1, line2) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        return !(ub < 0 || ub > 1);
    });
}

function intersectionSegmentSegment(line1, line2, line1p1inclusive = true, line1p2inclusive = true, line2p1inclusive = true, line2p2inclusive = true) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }

        if (ua === 0 && line1p1inclusive === false) {
            return false;
        }

        if (ua === 1 && line1p2inclusive === false) {
            return false;
        }

        if (ub === 0 && line2p1inclusive === false) {
            return false;
        }

        if (ub === 1 && line2p2inclusive === false) {
            return false;
        }

        return true;
    });
}

function intersectionSegmentRay(line1, line2, line1p1inclusive = true, line1p2inclusive = true, line2p1inclusive = true) {
    return intersectionStraightStraight(line1, line2, function (ua, ub) {
        if (ua < 0 || ua > 1 || ub < 0) {
            return false;
        }

        if (ua === 0 && line1p1inclusive === false) {
            return false;
        }

        if (ua === 1 && line1p2inclusive === false) {
            return false;
        }

        if (ub === 0 && line2p1inclusive === false) {
            return false;
        }

        return true;
    });
}

function intersectionStraightStraight(line1, line2, eliminationFunction) {
    let x1 = line1.p1.x;
    let y1 = line1.p1.y;
    let x2 = line1.p2.x;
    let y2 = line1.p2.y;
    let x3 = line2.p1.x;
    let y3 = line2.p1.y;
    let x4 = line2.p2.x;
    let y4 = line2.p2.y;

    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    if (eliminationFunction(ua, ub) === false) {
        return false;
    }

    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return new Point(x, y);
}

function modulus(dividend, divisor) {
    return ((dividend % divisor) + divisor) % divisor;
}
