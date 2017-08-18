# Shizzle

Better documenation coming soon I promise. Had to write this in 1 day because I got tired of dealing with Select2's weird api and had a tight deadline to meet.

 ![Alt text](shizzle.gif)

## Coming Soon!
Live demo, better documentation and evetually removing the dependency on jQuery.

## Recent Changes
* Added support for another dataValue container. dataValue4
* You can now set default data upon load ( setSelectedItems() ). 
* Also added placeholder support. 
* fireValidation() is now deprecated. Please use validate() instead.

## Example Usage
```javascript
      // Here's the markup you will need
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
        dataValue2: 'whatever you want here', // optional. Because sometimes a guy just needs to pass in some additional data
        dataValue3: 'whatever you want here', // optional. Because sometimes a guy just needs to pass in some additional data
        dataValue4: 'whatever you want here', // optional. Because sometimes a guy just needs to pass in some additional data
      }, {
        data: movies, //optional...or you can use the public method "populate()"
        itemsVisibleOnPageLoad: false,
        setToFocusOnPageLoad: true,
        isRequired: false,
        placeholder: 'type something here...',
        fieldErrorCss: '[your css class here]',
        showValidationMessage: false,
        validationMessageCss: '[your css class here]',
        validationMessageText: 'Recipient List is required',
        onItemSelected: yourCallbackHere,
        onPillRemoved: yourOtherCallback,
        onItemsCleared: yourOtherCallbackHere,
        /* 
        [shouldRepopulateOnRemove] (optional)
          -can be either a function or value
          -is used to more or less do a "check" before adding a pill back to the list of available options
            -true: the pill will be added back to the list of selectable options
            -false: the pill will not be added.
        */
        shouldRepopulateOnRemove: // Can be either a function that returns a bool or just a bool
      });


      // Public methods you can use
      multiSelect.clear();
      
      multiSelect.populate(movies);

      multiSelect.validate();

      multiSelect.setSelectedItems([{text: 'Oblivion', value: 'oblivion', value2: 'scifi'}]);

      var isValid = multiSelect.isValid();

      var selectedItems =  multiSelect.getSelectedItems();
```
