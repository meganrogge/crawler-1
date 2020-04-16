/**
 * Type safe function to get HTMLInputElements
 *
 * @param {string} query - the query string
 * @return {HTMLInputElement}
 */
export function getInput(query) {
  return /** @type {HTMLInputElement} */ (document.querySelector(query));
}

/**
 * Type safe function to get all HTMLInputElements
 *
 * @param {string} query - the query string
 * @returns {HTMLInputElement[]}
 */
export function getInputAll(query) {
  return [
    .../** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll(
      query
    ))
  ];
}

export function sortByDistance(array, x, y) {
    return array.sort(
      (a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y)
    );
}

export function sortByVisited(array, visitedRooms) {
  let exitsToVisited = array.filter(exit => visitedRooms.indexOf(exit.exit.nextroom) >= 0);
  let exitsToUnvisited = array.filter(exit => visitedRooms.indexOf(exit.exit.nextroom) < 0);
  let arr = exitsToUnvisited.concat(exitsToVisited);
  return arr;
}

export function sortOutChests(array){
  let nonChests = array.filter(i => !i.object.description || (i.object.description && (i.object.description != "red chest" && i.object.description != "green chest")));
  let chests = array.filter(i => i.objectDescription == "red chest" || i.objectDescription == "green chest");
  return nonChests;
}

export function sortForEnemies(enemy, array, power) {
  let non_enemies = array.filter(i => !i.object.description || i.object.description && (i.object.description != enemy && i.object.description != "ogre"));
  let enemies = array.filter(i => i.object.description == enemy || i.object.description == "ogre");
  let arr = non_enemies.concat(enemies);
  if(sum_of_object_rewards(non_enemies) + power <= 50){
    arr = non_enemies;
  }
  return { nonEnemies: arr, enemies: enemies};
}

function sum_of_object_rewards(non_enemies){
  let r = non_enemies.filter(i => i.object.power);
  if(r.length > 0){
    r = r.map(i => i.object.power).reduce((accumulator, currentValue) => accumulator + currentValue);
  } else {
    r = 0;
  }
  return r;
}
