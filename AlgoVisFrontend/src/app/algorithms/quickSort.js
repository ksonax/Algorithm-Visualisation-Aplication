//TODO Change to typeScript

let animations = [];
export function getAnimationsForQuickSort(array)
{
  let newArray = array.slice();
   quickSort(0,newArray.length,newArray);
   let tempArray = animations.slice();
   animations = [];
   return tempArray;
}

function quickSort(low,high,array)
{
  //Checking If low is less than High or not
  if(low < high)
  {
    // Make partition in which on left side all the smaller elemnts of partition and on the right hand side all the greater elements
    let j = partition(low,high,array);
    // Divinding the array with pivote taken as a partition
    quickSort(low,j,array);
    quickSort(j+1,high,array);
  }
  return array;
}

function partition(low,high,unsortedArray)
{
  let pivote = unsortedArray[low];
  animations.push(["pivoton",low]);
  let i = low;
  let j = high;

  while(i < j)
  {
    do
    {
      i++;
    }while(unsortedArray[i] <= pivote);

    do{
      j--;
    }while(unsortedArray[j] > pivote);

    if(i < j)
    {
      swap(i,j,unsortedArray);
      //Logic for animating highlihts and swaping
      animations.push(["highLighton",i,j]);
      animations.push(["highLightoff",i,j]);
      animations.push(["swap",i,j]);
    }

  }
  swap(low,j,unsortedArray);
  animations.push(["highLighton",low,j]);
  animations.push(["highLightoff",low,j]);
  animations.push(["swap",low,unsortedArray[low],j,unsortedArray[j]]);
  animations.push(["pivotOff",low]);
  return j;
}

function swap(i,j,unsortedArray)
{
  let temp = unsortedArray[i];
  unsortedArray[i] = unsortedArray[j];
  unsortedArray[j] = temp;
}
