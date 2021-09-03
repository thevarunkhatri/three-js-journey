uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uBigWavesElevation;
uniform float uColorOffset;
varying float vElevation;

void main() {

    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, (vElevation / uBigWavesElevation + 1.0) * 0.5 + uColorOffset);
    gl_FragColor = vec4(mixedColor, 1.0);
}