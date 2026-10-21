import type {Intersection, Object3D} from 'three';

const actions = ['sequence', 'cityDiscovery', 'chapter', 'skill', 'project', 'drum', 'secret', 'contact', 'water'];

/** Raycasting includes hidden ancestors; only visible, actionable objects should respond. */
export function visibleInteraction(hits: Pick<Intersection, 'object'>[]): Object3D | undefined {
  for (const {object} of hits) {
    let visible = true;
    let action: Object3D | undefined;
    for (let node: Object3D | null = object; node; node = node.parent) {
      if (!node.visible) { visible = false; break; }
      if (!action && actions.some(key => node.userData[key] !== undefined)) action = node;
    }
    if (visible && action) return action;
  }
}
