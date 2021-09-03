varying vec3 vColor;

void main() {

    // Standard Circle
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - step(0.5, strength);

    // Diffused Circle
    // float strength = 1.0 - distance(gl_PointCoord, vec2(0.5)) * 2.0;

    // Light Point
    float strength = 1.0 - distance(gl_PointCoord, vec2(0.5));
    strength = pow(strength, 15.0);

    // Final
    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}