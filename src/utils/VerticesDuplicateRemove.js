export function VerticesDuplicateRemove(arr) {
  const set = new Set()
  let t = []
  for (let i = 0; i < arr.length; i++) {
    t.push(arr[i])
    if (i % 3 === 2) {
      set.add(t.join(','))
      t = []
    }
  }
  const res = []
  set.forEach((val) => {
    res.push(...val.split(',').map(val => Number(val)))
  })

  return new Float32Array(res)
}
