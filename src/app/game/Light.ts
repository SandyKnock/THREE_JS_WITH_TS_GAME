import { AmbientLight, DirectionalLight, HemisphereLight, PointLight, Vector3 } from 'three';
import { Color } from 'three/three-core';

interface ILight {
  light: AmbientLight | DirectionalLight | PointLight | HemisphereLight
}

export default class Light implements ILight {
  public _light: AmbientLight | DirectionalLight | PointLight | HemisphereLight;


  constructor(light: AmbientLight | DirectionalLight | PointLight | HemisphereLight) {
    this._light = light;
  }

  get light(): AmbientLight | DirectionalLight | PointLight | HemisphereLight {
    return this._light;
  }

  set light(value: AmbientLight | DirectionalLight | PointLight | HemisphereLight) {
    this._light = value;
  }

  setLightSettings(color: Color, intensity: number, position: Vector3) {
    this._light.color = color;
    this._light.intensity = intensity;
    this._light.position.add(position);
  }


}
