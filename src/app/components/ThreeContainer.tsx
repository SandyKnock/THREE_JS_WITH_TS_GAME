import * as React from 'react';
import * as THREE from 'three';
import { GameCycle } from 'app/game/GameCycle';
import Light from 'app/game/Light';
import { AmbientLight, Color, DirectionalLight, Object3D, PointLight, Vector2, Vector3 } from 'three';
import LightArr from 'app/game/LightArr';
import { Player } from 'app/game/Player';
import { connect } from 'react-redux';
import { omit } from 'app/utils';
import { PlayerAction } from 'app/actions/PlayerAction';
import { bindActionCreators } from 'redux';
import { GameLoopAction } from 'app/actions/GameLoopAction';

import * as heightMap from '../../media/img/terrain.png';
import * as background from '../../media/img/test2.jpg';

import { Terrain } from 'app/game/Terrain';
import { TerrainAction } from 'app/actions/TerrainAction';
import { SkyBox } from 'app/game/SkyBox';
import { SkyBoxAction } from 'app/actions/SkyBoxAction';
import * as dat from 'dat.gui';
// import { SceneObjects } from 'app/game/SceneObjects';

const OrbitControls = require('three-orbit-controls')(THREE);
(window as any).THREE = THREE;
// @ts-ignore
const Water = require('three/examples/js/objects/Water.js');
// @ts-ignore
const Stats = require('three/examples/js/libs/stats.min.js');

export namespace ThreeContainerNamespace {

  export interface IProps {
    player: any,
    playerAction: any,
    gameLoop: any,
    gameLoopAction: any
    terrain: any,
    terrainAction: any,
    skyBox: any,
    skyBoxAction: any;
  }

  export const getLightArr = (): Array<Light> => {
    const lightArr = new LightArr([]);

    const ambientLight = new Light(new AmbientLight());
    ambientLight.setLightSettings(
      new Color(0xff5b5bde),
      0.5,
      new Vector3(0, 0, 0)
    );

    const directionalLight = new Light(new DirectionalLight());
    directionalLight.setLightSettings(
      new Color(0xffffff),
      0.5,
      new Vector3(500, 2000, 0)
    );

    const pointLight = new Light(new PointLight());
    pointLight.setLightSettings(
      new Color(0xffffc3b3),
      0.3,
      new Vector3(0, 2000, 0)
    );

    lightArr.addLightInArr(ambientLight);
    lightArr.addLightInArr(directionalLight);
    lightArr.addLightInArr(pointLight);
    return lightArr.lightArr;
  };

}

@connect(
  (state): Pick<ThreeContainerNamespace.IProps, 'player' | 'gameLoop' | 'terrain' | 'skyBox'> => ({
    player: state.playerReducer.player,
    gameLoop: state.gameLoopReducer.gameLoop,
    terrain: state.terrainReducer.terrain,
    skyBox: state.skyBoxReducer.skyBox
  }),
  (dispatch): Pick<ThreeContainerNamespace.IProps, 'playerAction' | 'gameLoopAction' |
    'terrainAction' | 'skyBoxAction'> => ({
    playerAction: bindActionCreators(omit(PlayerAction, 'Type'), dispatch),
    gameLoopAction: bindActionCreators(omit(GameLoopAction, 'Type'), dispatch),
    terrainAction: bindActionCreators(omit(TerrainAction, 'Type'), dispatch),
    skyBoxAction: bindActionCreators(omit(SkyBoxAction, 'Type'), dispatch)
  })
)
export default class ThreeContainer extends React.Component {

  props: any;
  private threeRootElement: any;
  private clock = new THREE.Clock();

  componentDidMount() {
    this.init();
  }

  water = null;
  stats = null;
  mixer = null;

  gameCycleSettings(gameCycle: GameCycle, INNER_WIDTH: number, INNER_HEIGHT: number) {
    gameCycle.scene.background = new THREE.Color(0xc1bebede);
    // gameCycle.scene.fog = new THREE.Fog(0xbbb8b8c2, 1000, 5000);
    gameCycle.camera.position.set(0, 200, -450);
    gameCycle.renderer.shadowMap.enabled = true;
    gameCycle.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //разобрать
    gameCycle.renderer.setSize(INNER_WIDTH, INNER_HEIGHT);
  }

  addTerrainMapToScene(gameCycle: GameCycle, terrainSize: Vector2, terrainPosition: Vector3) {
    const terrainMap = new Terrain(terrainSize.x, terrainSize.y);
    terrainMap.getTerrainMesh(heightMap, background).subscribe((mesh) => {
      mesh.position.x = terrainPosition.x;
      mesh.position.z = terrainPosition.z;
      mesh.position.y = terrainPosition.y;
      mesh.scale.y = 50.0;
      console.log(mesh);
      gameCycle.scene.add(mesh);
      this.props.terrainAction.setTerrain(terrainMap);

      // SceneObjects.getModelObservable('/models/Tree.mtl',
      //   '/models/Tree.obj'
      // ).subscribe((obj: Object3D) => {
      //   for (let i = 0; i < 10; i++) {
      //     let sceneObjects = new SceneObjects(obj.clone());
      //     let PLAYER_SCALE = Math.random() * 7;
      //     sceneObjects.model.scale.set(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
      //     let sceneObjectsPositionX = Math.random() * 1024;
      //     let sceneObjectsPositionZ = Math.random() * 1024;
      //     let sceneObjectsPositionY = terrainMap.getHeightAt(
      //       sceneObjectsPositionX,
      //       sceneObjectsPositionZ
      //     );
      //     sceneObjects.model.position.set(
      //       sceneObjectsPositionX,
      //       sceneObjectsPositionY * 50,
      //       sceneObjectsPositionZ
      //     );
      //     gameCycle.scene.add(sceneObjects.model);
      //   }
      //
      // });

    });
  }

  addWaterToScene(lightArr: Array<Light>, scene: THREE.Scene, terrainPosition: Vector3) {
    let waterGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    // @ts-ignore
    let water = new THREE.Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          '/img/waternormals3.jpg',
          (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }
        ),
        alpha: 0.9,
        sunDirection: lightArr[1].light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        // clipBias: 10,
        fog: scene.fog !== undefined
      }
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(
      terrainPosition.x,
      30,
      terrainPosition.z
    );
    //TODO FIX
    this.water = water;
    scene.add(water);
    return water;
  }

  updateSun(parameters: any, lightArr: Array<Light>, water: any) {
    let theta = Math.PI * (parameters.inclination - 0.5);
    let phi = 2 * Math.PI * (parameters.azimuth - 0.5);
    lightArr[1].light.position.x = parameters.distance * Math.cos(phi);
    lightArr[1].light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    lightArr[1].light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
    // sky.material.uniforms.sunPosition.value = light.position.copy( light.position );
    water.material.uniforms.sunDirection.value.copy(lightArr[1].light.position).normalize();
  }

  addGUI(lightArr: Array<Light>, water: any) {
    let parameters = {
      distance: 400,
      inclination: 0.49,
      azimuth: 0.205
    };

    // GUI
    let gui = new dat.GUI();
    let controlPanel = gui.addFolder('Sky');
    controlPanel.add(parameters, 'inclination', 0, 0.5, 0.0001).onChange(
      () => this.updateSun(parameters, lightArr, water)
    );
    controlPanel.add(parameters, 'azimuth', 0, 1, 0.0001).onChange(
      () => this.updateSun(parameters, lightArr, water)
    );//0.45
    controlPanel.open();

    let uniforms = water.material.uniforms;
    controlPanel = gui.addFolder('Water');
    controlPanel.add(
      uniforms.distortionScale,
      'value',
      0,
      8,
      0.1
    ).name('distortionScale');
    controlPanel.add(
      uniforms.size,
      'value',
      0.1,
      10,
      0.1
    ).name('size');
    controlPanel.add(
      uniforms.alpha,
      'value',
      0.9,
      1,
      .001
    ).name('alpha');
    controlPanel.addColor(uniforms.waterColor, 'value').name('waterColor');
    controlPanel.open();

    //stats
    this.stats = new Stats();
    //@ts-ignore
    this.threeRootElement.appendChild(this.stats.dom);
  }

  addSkyBoxToScene(terrainPosition: Vector3, scene: THREE.Scene) {
    let skyBoxTexturesUrl: Array<string> = [
      'right.png',
      'left.png',
      'top.png',
      'bottom.png',
      'front.png',
      'back.png'
    ];
    let skyBox = new SkyBox(
      '/img/',
      skyBoxTexturesUrl,
      2000,
      2000,
      2000
    );

    let model = skyBox.getSkyBoxModel();
    model.position.set(terrainPosition.x, 0, terrainPosition.z);
    this.props.skyBoxAction.setSkyBox(skyBox);

    scene.add(model);
  }

  addPlayerToScene(terrainPosition: Vector3, { camera, scene }: GameCycle) {
    Player.getModelObservable(
      '/models/SPAWN.mtl',
      '/models/SPAWN.obj'
    ).subscribe((obj: Object3D) => {
      const PLAYER_SCALE = 0.05;
      let player = new Player(obj.clone());
      this.props.playerAction.setPlayer(player);
      player.model.scale.set(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
      player.model.position.set(
        terrainPosition.x,
        terrainPosition.y,
        terrainPosition.z
      );
      player.model.add(camera);
      scene.add(player.model);
      player.listenForPlayerMovement();
      player.voiceForPlayerMovement();
    });
  }

  init() {
    const INNER_WIDTH = window.innerWidth, INNER_HEIGHT = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      INNER_WIDTH / INNER_HEIGHT,
      1,
      40000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const orbit = new OrbitControls(camera);
    const gameCycle = new GameCycle(camera, orbit, renderer, scene);
    this.gameCycleSettings(gameCycle, INNER_WIDTH, INNER_HEIGHT);
    this.threeRootElement.appendChild(gameCycle.renderer.domElement);

    const lightArr = ThreeContainerNamespace.getLightArr();
    lightArr.forEach((light: Light) => {
      gameCycle.scene.add(light.light);
    });


    //TerrainMap

    const WIDTH_TERRAIN = 1024;
    const HEIGHT_TERRAIN = 1024;
    const START_POSITION_TERRAIN_X = WIDTH_TERRAIN / 2;
    const START_POSITION_TERRAIN_Z = START_POSITION_TERRAIN_X;
    const START_POSITION_TERRAIN_Y = 0;
    const TERRAIN_POSITION = new Vector3(
      START_POSITION_TERRAIN_X,
      START_POSITION_TERRAIN_Y,
      START_POSITION_TERRAIN_Z
    );
    const TERRAIN_SIZE = new Vector2(WIDTH_TERRAIN, HEIGHT_TERRAIN);

    this.addTerrainMapToScene(gameCycle, TERRAIN_SIZE, TERRAIN_POSITION);

    //water
    let water = this.addWaterToScene(lightArr, gameCycle.scene, TERRAIN_POSITION);
    this.addGUI(lightArr, water);


    //skybox
    this.addSkyBoxToScene(TERRAIN_POSITION, gameCycle.scene);

    //Player
    this.addPlayerToScene(TERRAIN_POSITION, gameCycle);


    //test animation
    // Player.getModelObservable2(
    //   '/models/Only_Spider_with_Animations_Export.mtl',
    //   '/models/testcol.dae'
    // ).subscribe((obj: any) => {
    //
    //   let avatar = obj.scene;
    //   let animations = obj.animations;
    //   avatar.scale.set(2, 2, 2);
    //   avatar.position.set(
    //     START_POSITION_TERRAIN_X,
    //     20,
    //     START_POSITION_TERRAIN_Z
    //   );
    //   // @ts-ignore
    //   this.mixer = new THREE.AnimationMixer(avatar); // create global mixer
    //   // @ts-ignore
    //   this.mixer.clipAction(animations[0]).play(); // play first animation clip
    //   console.log(animations)
    //   gameCycle.scene.add(avatar);
    //
    // });


    gameCycle.onWindowResize();
    this.props.gameLoopAction.setGameLoop(gameCycle);
  }

  gameLoop = () => {
    this.gameRender();
    const delta = this.clock.getDelta();
    this.props.gameLoop._orbit.update();
    if (Object.keys(this.props.player).length !== 0 &&
      Object.keys(this.props.terrain).length !== 0) {
      let height = this.props.terrain.getHeightAt(
        this.props.player.model.position.x,
        this.props.player.model.position.z
      );
      this.props.player.playerMoving(delta, height, this.props.terrain._mesh.scale.y);
    }
    if (Object.keys(this.props.skyBox).length !== 0) {
      this.props.skyBox.model.rotation.y += 0.005 * delta;
    }

    if (this.mixer !== undefined && this.mixer !== null) {
      // @ts-ignore
      this.mixer.update(delta);

    }
    // @ts-ignore
    this.water.material.uniforms.time.value += 1.0 / 400.0;
    // setTimeout(() => {

    requestAnimationFrame(this.gameLoop);
    //@ts-ignore
    this.stats.update();
    // }, 1000 / 600);
  };


  gameRender = () => {
    this.props.gameLoop._renderer.render(this.props.gameLoop._scene, this.props.gameLoop._camera);
  };

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.gameLoop === this.props.gameLoop) {
      this.gameLoop();
    }
  }

  render() {
    return (
      <div>
        <div ref={element => this.threeRootElement = element} />
      </div>
    );
  }
}
