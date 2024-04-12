export default function createArrayOfNumbers(length) {
  let array = []

  for (let i = 1; i <= length; i++) {
    array.push(i)
  }
  return array
}

export const removeDuplicates = (arr) => Array.from(new Set(arr));