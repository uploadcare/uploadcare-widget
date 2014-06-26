describe 'UploadedCollection. ', ->

  it 'Basic methods.', ->
    collection = new uploadcare.utils.Collection()
    expect(collection.length()).toBe(0);
    expect(collection.get()).toEqual([]);

    item = {obj: 'ect'}
    collection.add(item)
    expect(collection.length()).toBe(1);
    expect(collection.get()).toEqual([item]);

    collection.add(item)
    expect(collection.length()).toBe(2);
    expect(collection.get()).toEqual([item, item]);

    collection.remove(item)
    expect(collection.length()).toBe(1);
    expect(collection.get()).toEqual([item]);

    collection.clear()
    expect(collection.length()).toBe(0);
    expect(collection.get()).toEqual([]);
