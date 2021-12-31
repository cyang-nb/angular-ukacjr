import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

export class vector3d {
  x: number;
  y: number;
  z: number;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vec: vector3d) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }

  minus(vec: vector3d) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
  }

  mult(scale: number) {
    this.x *= scale;
    this.y *= scale;
    this.z *= scale;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const magnitude = this.mag();
    this.x /= magnitude;
    this.y /= magnitude;
    this.z /= magnitude;
  }
}

export class vector3dOps {
  arr2Vector(numArray: number[]): vector3d {
    return new vector3d(numArray[0], numArray[1], numArray[2]);
  }

  dot(vec1: vector3d, vec2: vector3d): number {
    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
  }

  proj(vec1: vector3d, vec2: vector3d): vector3d {
    const tmp = vec2;
    tmp.normalize();
    const dotFactor = this.dot(vec1, tmp);
    tmp.mult(dotFactor);
    return tmp;
  }

  makeDisplayVector(input: vector3d, origin: vector3d): vector3d {
    const dest = input;
    const src = origin;
    dest.minus(src);
    const projected = this.proj(dest, src);
    dest.minus(projected);

    return dest;
  }
}

export class canvasCircle {
  color = 'red';
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;

  constructor(canvas, input: vector3d, radius: number, color?) {
    this.x = AppComponent.subjectCenter[0] - input.x;
    this.y = AppComponent.subjectCenter[1] + input.y;
    this.ctx = canvas;
    this.radius = radius;

    if (color != undefined) this.color = color;

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.radius, this.radius);
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular';

  point1 = this.LLA2XYZ(1.3126555470073757, 'N', 103.72150099772007, 'E', 8);
  point2 = this.LLA2XYZ(1.307859999051425, 'N', 103.72122556888472, 'E', 8);
  point3 = this.LLA2XYZ(1.312229347004029, 'N', 103.6971286400494, 'E', 11);
  point4 = this.LLA2XYZ(1.3521, 'N', 103.8198, 'E', 40);

  point5 = this.LLA2XYZ(31.7917, 'N', 7.0926, 'W', 141);
  point6 = this.LLA2XYZ(26.8206, 'N', 30.8025, 'E', 284);

  point7 = this.LLA2XYZ(38.4161, 'S', 63.6167, 'W', 123);
  displayPts;
  livePts;

  static subjectCenter: number[] = [150, 150];
  static scale;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  ctx2: CanvasRenderingContext2D;
  ctx3: CanvasRenderingContext2D;
  ctx4: CanvasRenderingContext2D;

  pts: canvasCircle[];
  pt1: canvasCircle;
  pt2: canvasCircle;
  pt3: canvasCircle;
  pt4: canvasCircle;

  vecOps: vector3dOps = new vector3dOps();

  constructor() {
    console.log(this.point1);
    // console.log(this.point2);
    // console.log(this.point3);
    console.log(this.point4);
    // console.log(this.point5);
    // console.log(this.point6);
    // console.log(this.point7);
    // console.log(this.str8LineDistance(this.point4,this.point1));

    // console.log(this.makeXYZSystem(this.point4)[0]);
    // console.log(this.makeXYZSystem(this.point4)[1]);
    // console.log(this.makeXYZSystem(this.point4)[2]);

    console.log(this.makeDisplayVector(this.point1, this.point4));

    const sgPt = this.vecOps.arr2Vector(this.point4);

    console.log(this.makeDisplayVector(this.point1, this.point4));

    this.displayPts = [
      this.vecOps.makeDisplayVector(this.vecOps.arr2Vector(this.point1), sgPt),
      this.vecOps.makeDisplayVector(this.vecOps.arr2Vector(this.point2), sgPt),
      this.vecOps.makeDisplayVector(this.vecOps.arr2Vector(this.point3), sgPt),
      // this.makeDisplayVector(this.point1, this.point4),
      // this.makeDisplayVector(this.point2, this.point4),
      // this.makeDisplayVector(this.point3, this.point4)
    ];

    for (let i = 0; i < this.displayPts.length; ++i)
      this.displayPts.push(
        new vector3d(
          this.displayPts[i].x,
          this.displayPts[i].y,
          this.displayPts[i].z
        )
      );

    // console.log(this.dot(this.displayPts[0], this.normalize(this.point4)));
    // console.log(this.dot(this.displayPts[1], this.normalize(this.point4)));
    // console.log(this.dot(this.displayPts[2], this.normalize(this.point4)));
    // console.log(
    //   this.dot(
    //     this.normalize(this.minus(this.point1, this.point4)),
    //     this.normalize(this.point4)
    //   )
    // );
    // console.log(this.displayPts);
    // console.log(newdisplayPts);
  }

  CC() {
    return this.canvas.nativeElement.getContext('2d');
  }

  ngOnInit(): void {
    const tmp = this.vecOps.arr2Vector([0, 0, 0]);
    this.pt4 = new canvasCircle(this.CC(), tmp, 2);

    this.pts = [
      new canvasCircle(this.CC(), this.displayPts[0], 2),
      new canvasCircle(this.CC(), this.displayPts[1], 2, 'blue'),
      new canvasCircle(this.CC(), this.displayPts[2], 2, 'green'),
    ];
  }

  updatePoints(event) {
    for (let i = 0; i < this.livePts.length; ++i) {
      this.livePts[i].x *= this.displayPts[i].x * event.value;
      this.livePts[i].y *= this.displayPts[i].y * event.value;
      this.livePts[i].z *= this.displayPts[i].z * event.value;
    }
  }

  add(start, offset) {
    return [start[0] + offset[0], start[1] + offset[1], start[2] + offset[2]];
  }

  minus(end, start) {
    return [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  }

  mult(vec, scale) {
    return [vec[0] * scale, vec[1] * scale, vec[2] * scale];
  }

  mag(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
  }

  dot(vec1, vec2) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
  }

  normalize(vec) {
    const mag = this.mag(vec);
    return [vec[0] / mag, vec[1] / mag, vec[2] / mag];
  }

  proj(vec1, vec2) {
    const unitVec2 = this.normalize(vec2);
    const dotFactor = this.dot(vec1, unitVec2);
    return this.mult(unitVec2, dotFactor);
  }

  str8LineDistance(dest, src) {
    return this.mag(this.minus(dest, src));
  }

  makeDisplayVector(input, origin) {
    const rawOffset = this.minus(input, origin);
    console.log(rawOffset);
    const projected = this.proj(rawOffset, origin);
    const projOffset = this.minus(rawOffset, projected);

    return this.minus(rawOffset, projected);
  }

  LLA2XYZ(lat, latFlag, lon, lonFlag, alt): number[] {
    alt /= 1000;
    const equatorial = 6378.137 + alt;
    const polar = 6356.7523142 + alt;

    if (lonFlag == 'W') lon = 360 - lon;

    if ((lon >= 270 || lon < 90) && latFlag == 'N') lat = lat * -1 + 360;

    if (lon >= 90 && lon < 270 && latFlag == 'S') lat = lat * -1 + 360;

    lat = (lat * Math.PI) / 180;
    lon = (lon * Math.PI) / 180;

    const lonPass = [Math.cos(lon), Math.sin(lon), 0];
    const latPass = [
      lonPass[0] * Math.cos(lat),
      lonPass[1],
      -1 * lonPass[0] * Math.sin(lat),
    ];
    const altPass = [
      latPass[0] * equatorial,
      latPass[1] * equatorial,
      latPass[2] * polar,
    ];

    return altPass;
  }
}
