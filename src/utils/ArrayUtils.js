function swap(arr, index1, index2) {
  const temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}

function mixArray(arr, mixLevel) {
  const length = arr.length;
  for (let i = 0; i < mixLevel; i++) {
    const index1 = Math.floor(Math.random() * length);
    const index2 = Math.floor(Math.random() * length);
    swap(arr, index1, index2);
  }
  return arr;
}

export const ArrayUtils = {
  mixArray,
  swap,
};
