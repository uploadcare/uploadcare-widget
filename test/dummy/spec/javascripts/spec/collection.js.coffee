describe 'UploadedCollection.', ->

  it 'Basic methods.', ->
    collection = new uploadcare.utils.Collection()
    expect(collection.length()).toBe(0);
    expect(collection.get()).toEqual([]);

    collection.add('1')
    expect(collection.length()).toBe(1);
    expect(collection.get()).toEqual(['1']);

    collection.add('2')
    expect(collection.length()).toBe(2);
    expect(collection.get()).toEqual('12'.split(''));

    collection.remove('1')
    expect(collection.length()).toBe(1);
    expect(collection.get()).toEqual(['2']);

    collection.clear()
    expect(collection.length()).toBe(0);
    expect(collection.get()).toEqual([]);

  it 'Sort and replace.', ->
    collection = new uploadcare.utils.Collection('1234'.split(''))
    expect(collection.length()).toBe(4);
    expect(collection.get()).toEqual('1234'.split(''));

    collection.replace '2', '2'
    expect(collection.get()).toEqual('1234'.split(''));

    collection.replace '2', '5'
    expect(collection.get()).toEqual('1534'.split(''));

    collection.replace '8', '5'
    expect(collection.get()).toEqual('1534'.split(''));

    collection.sort()
    expect(collection.get()).toEqual('1345'.split(''));


describe 'UploadedCollectionOfPromises.', ->

  it 'Resolved promises are added.', ->
    fired = 0

    collection = new uploadcare.utils.CollectionOfPromises()
    collection.onAnyDone (promise, value) ->
      expect(value).toBe('done')
      fired += 1
    collection.add($.Deferred().resolve('done').promise())
    collection.add($.Deferred().resolve('done').promise())

    waitsFor(->
      fired == 2
    , "Should fire", 100)


  it 'Not resolved promises are added and then resolved.', ->
    fired = 0

    collection = new uploadcare.utils.CollectionOfPromises()
    collection.onAnyDone (promise, value) ->
      expect(value).toBe('done')
      fired += 1

    deferred = $.Deferred()
    collection.add(deferred.promise())
    deferred.resolve('done')
    deferred = $.Deferred()
    collection.add(deferred.promise())
    deferred.resolve('done')

    waitsFor(->
      fired == 2
    , "Should fire", 100)


  it 'Promise resolved before callback.', ->
    fired = 0

    collection = new uploadcare.utils.CollectionOfPromises()
    collection.add($.Deferred().resolve('done').promise())
    collection.add($.Deferred().resolve('done').promise())

    collection.onAnyDone (promise, value) ->
      expect(value).toBe('done')
      fired += 1

    waitsFor(->
      fired == 2
    , "Should fire", 100)
