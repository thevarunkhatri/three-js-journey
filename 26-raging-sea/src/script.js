import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { Vector2 } from 'three'

// console.log(waterFragmentShader)
// console.log(waterVertexShader)

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
debugObject.sizeMultiplier = 2;
const waterGeometry = new THREE.PlaneGeometry(2 * debugObject.sizeMultiplier, 2 * debugObject.sizeMultiplier, 128 * debugObject.sizeMultiplier, 128 * debugObject.sizeMultiplier)

debugObject.depthColor = '#1a4966'
debugObject.surfaceColor = '#9bd8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uTime: {value: 0},
        
        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
        uBigWavesSpeed: {value: 0.75},

        uSmallWavesElevation: {value: 0.15},
        uSmallWavesFrequency: {value: 2.5},
        uSmallWavesSpeed: {value: 0.2},
        uSmallWavesIteration: {value: 4},

        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0},
    }
})


gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.01).name('uBigWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.01).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.01).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(1).step(0.01).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesIteration, 'value').min(0).max(8).step(1).name('uSmallWavesIteration')
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(-1).max(1).step(0.01).name('uColorOffset')


gui
    .addColor(debugObject, 'depthColor')
    .onChange(() => { 
        waterMaterial.uniforms.uDepthColor.value = new THREE.Color(debugObject.depthColor)
    })

gui
    .addColor(debugObject, 'surfaceColor')
    .onChange(() => { 
        waterMaterial.uniforms.uSurfaceColor.value = new THREE.Color(debugObject.surfaceColor)
    })


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()