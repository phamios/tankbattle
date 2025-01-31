import EVENT from '../event';

const mapper: { [K in string]: string } = {
  // p1
  w: EVENT.CONTROL.P1.UP,
  a: EVENT.CONTROL.P1.LEFT,
  s: EVENT.CONTROL.P1.DOWN,
  d: EVENT.CONTROL.P1.RIGHT,
  g: EVENT.CONTROL.P1.A,
  h: EVENT.CONTROL.P1.B,
  v: EVENT.CONTROL.P1.SELECT,
  b: EVENT.CONTROL.P1.START,
  // p2
  arrowup: EVENT.CONTROL.P2.UP,
  arrowleft: EVENT.CONTROL.P2.LEFT,
  arrowdown: EVENT.CONTROL.P2.DOWN,
  arrowright: EVENT.CONTROL.P2.RIGHT,
  k: EVENT.CONTROL.P2.A,
  l: EVENT.CONTROL.P2.B,
};

const preventKey = ['arrowup', 'arrowleft', 'arrowdown', 'arrowright'];
const P1_DIRECTION = ['w', 'a', 's', 'd'];
const P2_DIRECTION = ['arrowup', 'arrowleft', 'arrowdown', 'arrowright'];

/**
 * keyboard Control
 */
class Keyboard implements IController {
  private events: IControllerEvent[] = [];
  private eventManager = EVENT.EM;
  private keys: { [K in string]: boolean } = {};

  constructor() {
    document.addEventListener('keydown', e => {
      const key = e.key.toLocaleLowerCase();
      if (preventKey.includes(key)) {
        e.preventDefault();
      }
      if (P1_DIRECTION.includes(e.key)) {
        P1_DIRECTION.forEach(key => {
          if (this.keys[key]) {
            this.release(key);
          }
        });
      } else if (P2_DIRECTION.includes(e.key)) {
        P2_DIRECTION.forEach(key => {
          if (this.keys[key]) {
            this.release(key);
          }
        });
      }

      this.press(key);
    });
    document.addEventListener('keyup', e => {
      const key = e.key.toLocaleLowerCase();
      e.preventDefault();
      if (!this.keys[key]) return;
      this.release(key);
    });
  }

  public press(key: string) {
    console.debug('press key:', key);
    this.keys[key] = true;
    this.events.push({ type: 'KEY_PRESS', key: mapper[key] });
  }

  public release(key: string) {
    console.debug('release key:', key);
    this.keys[key] = false;
    this.events.push({ type: 'KEY_RELEASE', key: mapper[key] });
  }

  public emitControl(): void {
    this.events.forEach(event => {
      this.eventManager.fireEvent<IControllerEvent>(event);
    });
    this.events = [];
  }
}

export default new Keyboard();
