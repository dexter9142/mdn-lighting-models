var MDN = MDN || {};

MDN.matrixArrayToCssMatrix = function (array) {
  return "matrix3d(" + array.join(',') + ")";
}

MDN.multiplyPoint = function (matrix, point) {
  
  var x = point[0], y = point[1], z = point[2], w = point[3];
  
  var c1r1 = matrix[ 0], c2r1 = matrix[ 1], c3r1 = matrix[ 2], c4r1 = matrix[ 3],
      c1r2 = matrix[ 4], c2r2 = matrix[ 5], c3r2 = matrix[ 6], c4r2 = matrix[ 7],
      c1r3 = matrix[ 8], c2r3 = matrix[ 9], c3r3 = matrix[10], c4r3 = matrix[11],
      c1r4 = matrix[12], c2r4 = matrix[13], c3r4 = matrix[14], c4r4 = matrix[15];
  
  return [
    x*c1r1 + y*c1r2 + z*c1r3 + w*c1r4,
    x*c2r1 + y*c2r2 + z*c2r3 + w*c2r4,
    x*c3r1 + y*c3r2 + z*c3r3 + w*c3r4,
    x*c4r1 + y*c4r2 + z*c4r3 + w*c4r4
  ];
}

MDN.multiplyMatrices = function (a, b) {
  
  // TODO - Simplify for explanation
  // currently taken from https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js#L306-L337
  
  var result = [];
  
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
      a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
      a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
      a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
  result[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  result[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  result[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  result[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  return result;
}

MDN.multiplyArrayOfMatrices = function (matrices) {
  
  var inputMatrix = matrices[0];
  
  for(var i=1; i < matrices.length; i++) {
    inputMatrix = MDN.multiplyMatrices(inputMatrix, matrices[i]);
  }
  
  return inputMatrix;
}

MDN.normalMatrix = function (matrix) {

  /*
    This function takes the inverse and then transpose of the provided
    4x4 matrix. The result is a 3x3 matrix. Essentially the translation
    part of the matrix gets removed.
  
    https://github.com/toji/gl-matrix
  */
  
  var a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3],
      a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7],
      a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11],
      a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      // Calculate the determinant
      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) { 
    return null; 
  }
  det = 1.0 / det;
  
  var result = []

  result[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  result[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  result[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  result[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  result[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  result[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  result[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  result[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  result[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return result;
}

MDN.rotateXMatrix = function (a) {
  
  var cos = Math.cos;
  var sin = Math.sin;
  
  return [
       1,       0,        0,     0,
       0,  cos(a),  -sin(a),     0,
       0,  sin(a),   cos(a),     0,
       0,       0,        0,     1
  ];
}

MDN.rotateYMatrix = function (a) {

  var cos = Math.cos;
  var sin = Math.sin;
  
  return [
     cos(a),   0, sin(a),   0,
          0,   1,      0,   0,
    -sin(a),   0, cos(a),   0,
          0,   0,      0,   1
  ];
}

MDN.rotateZMatrix = function (a) {

  var cos = Math.cos;
  var sin = Math.sin;
  
  return [
    cos(a), -sin(a),    0,    0,
    sin(a),  cos(a),    0,    0,
         0,       0,    1,    0,
         0,       0,    0,    1
  ];
}

MDN.translateMatrix = function (x, y, z) {
	return [
	    1,    0,    0,   0,
	    0,    1,    0,   0,
	    0,    0,    1,   0,
	    x,    y,    z,   1
	];
}

MDN.scaleMatrix = function (w, h, d) {
	return [
	    w,    0,    0,   0,
	    0,    h,    0,   0,
	    0,    0,    d,   0,
	    0,    0,    0,   1
	];
}

MDN.perspectiveMatrix = function (fieldOfViewInRadians, aspectRatio, near, far) {
  
  // Construct a perspective matrix
  
  /*
     Field of view - the angle in radians of what's in view along the Y axis
     Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
     Near - Anything before this point in the Z direction gets clipped (resultside of the clip space)
     Far - Anything after this point in the Z direction gets clipped (outside of the clip space)
  */
  
  var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
  var rangeInv = 1 / (near - far);
 
  return [
    f / aspectRatio, 0,                          0,   0,
    0,               f,                          0,   0,
    0,               0,    (near + far) * rangeInv,  -1,
    0,               0,  near * far * rangeInv * 2,   0
  ];
}

MDN.orthographicMatrix = function(left, right, bottom, top, near, far) {
  
  // Each of the parameters represents the plane of the bounding box
  
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
	
  var row4col1 = (left + right) * lr;
  var row4col2 = (top + bottom) * bt;
  var row4col3 = (far + near) * nf;
  
  return [
     -2 * lr,        0,        0, 0,
           0,  -2 * bt,        0, 0,
           0,        0,   2 * nf, 0,
    row4col1, row4col2, row4col3, 1
  ];
}

MDN.normalize = function( vector ) {
  
  // A utility function to make a vector have a length of 1
  
  var length = Math.sqrt(
    vector[0] * vector[0] +
    vector[1] * vector[1] +
    vector[2] * vector[2]
  )
  
  return [
    vector[0] / length,
    vector[1] / length,
    vector[2] / length
  ]
}
