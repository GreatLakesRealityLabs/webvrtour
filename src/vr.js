/**
 * @author: Sokwhan Huh
 * @date: January 22nd, 2018
 * 
 * Entry point of KLA Office Tour. Performs initialization of WebGL & WebVR
 * 
 * Original Source referenced from https://github.com/toji/webvr.info
 * 
 * Use of this source code is governed by a BSD-style license that can be found in the LICENSE file.
 */

(function () {
  "use strict";
  
  // Projection Matrix for the panorama in non-VR view
  var projectionMat = mat4.create();

  // WebGL setup.
  var gl = null;
  var panorama = null;
  var webglCanvas = document.getElementById("webgl-canvas");

  // Performs initialization of WebGL & Panorama module
  function init() {
    var glAttribs = {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true
    };
    gl = webglCanvas.getContext("webgl", glAttribs);
    // Utilize depth buffer to perform depth testing. This improves performance as we don't draw
    // fragments that is behind other geometry or is too far
    gl.enable(gl.DEPTH_TEST);
    // Enable culling to improve performance. No need to draw triangles that we can't see
    gl.enable(gl.CULL_FACE);

    panorama = new Panorama(gl);
    panorama.setImage("media/textures/kla_office_1.jpg");

    onResize();
    window.requestAnimationFrame(onAnimationFrame);
  }

  // ================================
  // WebVR-specific code begins here.
  // ================================

  function onVRRequestPresent() {
    alert("code me!");
  }

  function onResize() {
    webglCanvas.width = webglCanvas.offsetWidth * window.devicePixelRatio;
    webglCanvas.height = webglCanvas.offsetHeight * window.devicePixelRatio;
  }

  function onAnimationFrame(t) {
    // do not attempt to render if there is no available WebGL context
    if (!gl || !panorama) {
      return;
    }

    // Clear rendering context or previous frame's buffer will remain on screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    window.requestAnimationFrame(onAnimationFrame);
    gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
    mat4.perspective(projectionMat, Math.PI * 0.4, webglCanvas.width / webglCanvas.height, 0.1, 1024.0);
    panorama.render(projectionMat, mat4.create());
  }

  // Program Entry
  init();
  VRSamplesUtil.addButton("Enter VR", "E", "media/icons/cardboard64.png", onVRRequestPresent);
})();