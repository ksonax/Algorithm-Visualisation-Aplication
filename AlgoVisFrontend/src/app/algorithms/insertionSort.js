let animations = [];

export function getAnimationsForInsertionSort(array)
{
  let tempArray = array.slice();
  console.log(tempArray);
  insertionSort(tempArray);

  let tempAnimations = animations.slice();
  animations = [];
  return tempAnimations;
}

function insertionSort(array){
  let arrayLength = array.length;

  for(let i=1; i< arrayLength; i++)
  {
    let key = array[i];
    let j = i -1;
    while((j>=0)&&(key < array[j])){
        array[j+1] = array[j];

        animations.push(["HighLightOn",j+1,j]);
        animations.push(["HighLightOff",j+1,j]);
        animations.push(["Swap",j,array[j],j+1,array[j+1]]);
        j--;
    }
    array[j+1] = key;
  }

  console.log(array);
}