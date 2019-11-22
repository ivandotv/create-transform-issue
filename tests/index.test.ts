import { createTransformer } from 'mobx-utils'
import { observable, decorate, reaction } from 'mobx'
class Item {
  name: string
  id: number
  array: number[]
  data: any
  constructor(id: number, name: string) {
    this.id = id
    this.name = name
    this.array = [1]
    this.data = {
      prop1: 'prop1',
      prop2: 'prop2',
    }
  }
}
decorate(Item, {
  id: observable,
  name: observable,
  array: observable,
  data: observable,
})

let serializeName: any, dtoName: any
beforeEach(() => {
  serializeName = jest.fn(name => name + '-')

  dtoName = createTransformer(name => {
    return serializeName(name)
  })
})
describe('Mobx Test', () => {
  test('Create transform - change second object', () => {
    const item1 = new Item(1, 'jack')
    const item2 = new Item(2, 'bob')

    reaction(
      () => {
        return {
          name: dtoName(item1.name),
        }
      },
      data => {}
    )
    reaction(
      () => {
        return {
          name: dtoName(item2.name),
        }
      },
      data => {}
    )

    item1.name = 'bob'
    item1.name = 'jack'
    item1.name = 'bob'
    item1.name = 'jack'
    item1.name = 'bob'
    // 4 calls for the above code
    // --------------
    item2.name = 'jack' // +1 for calls
    item2.name = 'bob' // +1 for calls
    item2.name = 'jack' // +1 for calls

    expect(serializeName).toBeCalledTimes(6)
  })
})
