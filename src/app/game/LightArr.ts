import Light from 'app/game/Light';

interface ILightArr {
  lightArr: Array<Light>
}

export default class LightArr implements ILightArr {
  private _lightArr: Array<Light>;


  constructor(lightArr: Array<Light>) {
    this._lightArr = lightArr;
  }


  get lightArr(): Array<Light> {
    return this._lightArr;
  }

  set lightArr(value: Array<Light>) {
    this._lightArr = value;
  }

  addLightInArr(light: Light) {
    this._lightArr.push(light);
  }
}
