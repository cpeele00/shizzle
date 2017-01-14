# Shizzle

Documenation coming soon I promise. Had to write this in 1 day because I got tired of dealing with Select2's weird api and had a tight deadline to meet.

I'll provide a quick sample usage for now. More details coming soon! I'll have this whole thing tightened up by end of week. Until then **Use at own risk**

**NOTE** requires **jquery and lodash** (yes, one day soon I'll remove the dependency on jquery...but I was in a time crunch)

 ![Alt text](shizzle.gif)

## Coming Soon!
Live demo and better documentation...bear with me guys :-)

      // Here's the mark up you will need
      <select id="my-filter" class="shizzle"></select>


      // Sample data
      var movies = [
        {id: 1, text: 'The Maze Runner', value: 'maze-runner'}, 
        {id: 2, text: 'The Scorch Trials', value: 'scorch-trials'},
        {id: 3, text: 'Oblivion', value: 'oblivion'},
        {id: 4, text: 'War of the Worlds', value: 'war-worlds'},
      ];


      // Configure the multiSelect with options
      var multiSelect = new Shizzle('my-filter', {
        dataValue: 'value', // required to map your fields
        dataText: 'text', // required to map your fields
        dataValue2: 'whatever you want here", // optional. Because sometimes a guy just needs to pass in some additional data
        dataValue3: 'whatever you want here", // optional. Because sometimes a guy just needs to pass in some additional data
      }, {
        data: movies, //optional...or you can use the public method "populate()"
        itemsVisibleOnPageLoad: false,
        setToFocusOnPageLoad: true,
        isRequired: false,
        fieldErrorCss: '[your css class here]',
        showValidationMessage: false,
        validationMessageCss: '[your css class here]',
        validationMessageText: 'Recipient List is required',
        onItemSelected: yourCallbackHere,
        onPillRemoved: yourOtherCallback,
        onItemsCleared: yourOtherCallbackHere
      });


      // Public methods you can use
      multiSelect.clear();
      
      multiSelect.populate(movies);

      multiSelect.fireValidation();

      var isValid = multiSelect.isValid();

      var selectedItems =  multiSelect.getSelectedItems();
