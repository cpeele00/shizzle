var $ = require('jquery');
var _ = require('lodash');


function Shizzle(id, dataFields, options){
  'use strict';

  var self = this;
  var id = id;
  var $searchBox = null;
  var $items = null;
  var $pills = null;
  var dataText = null;
  var dataValue = null;
  var dataValue2 = null;
  var dataValue3 = null;
  var dataValue4 = null;
  var data = null;
  var itemsVisibleOnPageLoad = false;
  var setToFocusOnPageLoad = false;
  var onItemSelected = null;
  var onPillRemoved = null;
  var onItemsCleared = null;
  var isRequired = false;
  var fieldErrorCss = null;
  var showValidationMessage = false;
  var validationMessageCss = null; 
  var validationMessageText = null;
  var validationTriggered = false;
  var placeholder = '';
  var shouldRepopulateOnRemove = true;

  self.dataSource = null;
  self.items = [];
  self.filteredItems = [];
  self.pills = [];
  self.$pillContainer = null;

  // 
  // INITIALIZE
  //
  
  init();


  function init(){
    if (!id)
      throw new Error('id is required');

    if (!dataFields)
      throw new Error('dataFields are required');

    // Map the data fields 
    setDataFields(dataFields);

    // Set options
    if (options){
      data = options.data || null;
      itemsVisibleOnPageLoad = options.itemsVisibleOnPageLoad || false;
      onItemSelected = options.onItemSelected || null;
      onPillRemoved = options.onPillRemoved || null;
      onItemsCleared = options.onItemsCleared || null;
      setToFocusOnPageLoad = options.setToFocusOnPageLoad || false;
      fieldErrorCss =  options.fieldErrorCss || null;
      isRequired = options.isRequired || null;
      showValidationMessage = options.showValidationMessage || false;
      validationMessageCss = options.validationMessageCss || null;
      validationMessageText = options.validationMessageText || null;
      placeholder = options.placeholder || '';
      shouldRepopulateOnRemove = options.shouldRepopulateOnRemove || true;
    }

    // Set data source
    self.dataSource = _.sortBy(data, ['text']);
    self.items = _.cloneDeep(self.dataSource);

    // Create Elements
    var select = document.getElementById(id);
    createMainShizzleContainer(select, id);

    // Initialize dynamically created containers
    $items = $('#shizzle-container-' + id).find('.sz-choices');
    $searchBox = $('#shizzle-container-' + id).find('[search-box]');
    self.$pillContainer = $('#shizzle-container-' + id).find('.sz-pills');


    if (isRequired && showValidationMessage)
      createValidationMessage();


    //hide the dropdown initially
    if (itemsVisibleOnPageLoad)
      $items.show();
    else
      $items.hide();


    // Bring the control into focus as soon as page loads
    if (setToFocusOnPageLoad)
      $searchBox.focus();


    // Populate the dropdown now if initial data is present
    if (self.items)
      populateList(self.items);

    // Bind our events for the control
    bindEvents();
  }

  function bindEvents(){
    handleSearchBoxKeyupAndChange();
    handleKeypress();
    handleOutsideClicked();
    handleSearchBoxclicked();
    handleItemSelected();
    handlePillClicked();
  }


  //
  // Events
  //

  function handleSearchBoxKeyupAndChange(){
    $searchBox.on('keyup change', function(e) {
      // Clear temporary array
      self.filteredItems.length = 0;
      $items.empty();

      // Iterate through our items and verify if matching the filter
      _.forEach(self.items, function (item) {

        // Add the item to the filtered items list if the entered value is present in
        // the provided dataText property value
        if (item[dataText].toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
          addFilteredItem(item);
        }

      });

      // Re-populate list based on the filtered set
      populateList(self.filteredItems);
    });
  }

  function handleKeypress() {
    $searchBox.on('keypress', function(e) {
      // If the list is not visible show it
      // when the user types in the input field
      if ($items.not(':visible'))
        $items.show();
    });
  }

  function handleOutsideClicked() {
    $(document).click(function() {
      $items.hide();
    });
  }

  function handleSearchBoxclicked() {
    $searchBox.click(function(e) {
      e.stopPropagation();

      $items.toggle();
    });
  }

  function handleItemSelected() {
    $(document).on('click', '#shizzle-container-' + id + ' .sz-choices li', function() {

      // Get the selectedItem text
      self.selectedItem = {
        value: $(this).data('value'),
        text: $(this).text(),
        value2: $(this).attr('data-value-2'),
        value3: $(this).attr('data-value-3'),
        value4: $(this).attr('data-value-4')
      };

      $searchBox.val('');
      $searchBox.focus();
      // Toggle items
      $items.toggle();

      self.addPill(self.selectedItem);

      // Fire onItemSelected callback if provided
      if (onItemSelected)
        onItemSelected();
    });
  }


  //
  // Helpers
  //

  function setDataFields(dataFields){
    //TODO: look at removing this since we are already checking for it when initializing
    if (dataFields) {
      if (!dataFields.dataValue)
        throw new Error('dataValue is required');

      if (!dataFields.dataText)
        throw new Error('displayText is required');

      dataValue = dataFields.dataValue;
      dataText = dataFields.dataText;
      dataValue2 = dataFields.dataValue2;
      dataValue3 = dataFields.dataValue3;
      dataValue4 = dataFields.dataValue4;
    }
  }

  function createMainShizzleContainer(mainSelectElement, id){
    var selectContainer = document.createElement('div');
    selectContainer.id = 'shizzle-container-' + id;
    selectContainer.className = 'shizzlex';
    selectContainer.innerHTML = '<ul class=\'shizzlex sz-pills\'><li class=\'sz-search-box-container\'><input type=\'text\' search-box placeholder="' + placeholder + '" class=\'sz-search-box\' style=\'width: 100%; border: 0; outline: none; box-shadow: 0 0 0 #fff !important; -webkit-box-shadow: 0 0 0 #fff !important;\'/></li></ul><ul class=\'shizzlex sz-choices\'></ul>';

    insertAfter(selectContainer, mainSelectElement);
  }

  function populateList(data) {
    if (!data)
      return;

    $items.empty();

    // Only get unique array items.
    // This will avoid any side-effects or bugs from
    // consuming clients that may cause duplicate items
    // to display in the list
    var uniqueItems = _.uniqBy(data, dataValue);

    _.forEach(uniqueItems, function (item) {
      $items.append("<li data-value='" + item[dataValue] + "' data-value-2='" + item[dataValue2] + "' data-value-3='" + item[dataValue3] + "' data-value-4='" + item[dataValue4] + "'>" + item[dataText] + '</li>');
    });
  }

  function handlePillClicked(){
    $(document).on('click', '#shizzle-container-' + id + ' .sz-pills li', function(e) {
      
      var selectedPill = {};
      selectedPill[dataValue] = $(this).data('value');
      selectedPill[dataText] = $(this).data('text');
      selectedPill[dataValue2] = $(this).attr('data-value-2');
      selectedPill[dataValue3] = $(this).attr('data-value-3');
      selectedPill[dataValue4] = $(this).attr('data-value-4');

      var result = true;

      if ($.isFunction(shouldRepopulateOnRemove))
        shouldRepopulateOnRemove(selectedPill);		
      else		
        result = shouldRepopulateOnRemove;		


      if (result)
        self.items.push(selectedPill);


      _.remove(self.pills, function(pill){
        return pill.value === selectedPill[dataValue];
      });

      var pillElementToRemove = $('[data-value="' + selectedPill[dataValue] + '"]');
      pillElementToRemove.remove();

      populateList(_.sortBy(self.items, ['text']));

      $searchBox.focus();

      if (validationTriggered)
        fireValidation();

      if (onPillRemoved)
        onPillRemoved();
    });
  }

  function addFilteredItem(item) {
    var itemExists = false;

    // Verify if item already exists in filtered array
    _.forEach(self.filteredItems, function (filteredItem) {
      if (filteredItem[dataValue] === item[dataValue])
        itemExists = true;
    });

    if (!itemExists) {
      // Add item to filtered array
      self.filteredItems.push(item);
    }
  }

  function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  }

  function fireValidation(){
    if (isRequired){
      validationTriggered = true;

      if (self.pills.length === 0){
        self.$pillContainer.addClass(fieldErrorCss);

        if (showValidationMessage)
          showValidationMessageText();

      } else {
        self.$pillContainer.removeClass(fieldErrorCss);
      }
    }
  }

  function createValidationMessage(){
    var spanMessage = document.createElement('span');
    spanMessage.className = 'shizzlex sz-validation-message ' + validationMessageCss;
    spanMessage.innerText = validationMessageText;
    spanMessage.style.display = 'none';

    var parentEl = document.getElementById('shizzle-container-' + id);
    insertAfter(spanMessage, parentEl);
  }

  function showValidationMessageText(){
    $('.' + validationMessageCss).show();
  }

  function hideValidationMessageText(){
    $('.' + validationMessageCss).hide();
  }

  function doesItemExist(items, item){
    var itemExists = false;
    
    // Verify if item already exists in filtered array
    _.forEach(items, function (filteredItem) {
        if (filteredItem.value.toLowerCase() === item.value.toLowerCase())
            itemExists = true;
    });

    return itemExists;
  }


  this.addPill = function(selectedItem){
    // Ensure we don't add duplicates
    var itemExists = doesItemExist(self.pills, selectedItem);
    
    if (itemExists)
        return;


    self.pills.push(selectedItem);

    var pillElement = document.createElement('li');
    pillElement.setAttribute('data-id', selectedItem.id);
    pillElement.setAttribute('data-text', selectedItem.text);
    pillElement.setAttribute('data-value', selectedItem.value);
    pillElement.setAttribute('data-value-2', selectedItem.value2);
    pillElement.setAttribute('data-value-3', selectedItem.value3);
    pillElement.setAttribute('data-value-4', selectedItem.value4);
    pillElement.className = 'sz-pill';
    pillElement.innerHTML = '<span>' + selectedItem.text + '</span><span class=\'sz-close sz-hairline\'></span>';
    $(pillElement).insertBefore($('#shizzle-container-' + id).find('[search-box]').parent());

    $pills = $('#shizzle-container-' + id).find('.sz-pill');

    _.remove(self.items, function(item){
      return item[dataValue] === selectedItem.value;
    });

    if (validationTriggered)
      fireValidation();

    if (isRequired && showValidationMessage)
      hideValidationMessageText();

    populateList(self.items);
  };

  this.clearData = function(){
    self.dataSource = null;
    self.items = null;
    self.pills.length = 0;
    self.filteredItems.length = 0;
    $searchBox.val('');
    $items.empty();
    $items.hide();

    if ($pills)
      $pills.remove();

    if (onItemsCleared)
      onItemsCleared();
  };

  this.populateWithData = function(data) {
    // Set data source
    self.dataSource = _.sortBy(data, ['text']);
    self.items = _.cloneDeep(self.dataSource);

    populateList(self.items);
  };

  this.validateControl = function(){
    fireValidation();
  };
};


//
// Public methods
//


Shizzle.prototype.getSelectedItems = function(){
  return this.pills;
};

Shizzle.prototype.setSelectedItems = function(selectedItems){
  var self = this;
  _.forEach(selectedItems, function(item) {
    self.addPill(item);
  });
};

Shizzle.prototype.clear = function() {
  this.clearData();
};

Shizzle.prototype.populate = function(data) {
  this.populateWithData(data);
};

Shizzle.prototype.isValid = function(){
  if(this.pills.length === 0)
    return false;
  else
    return true;
};

/**
 * @deprecated Since version 1.1.0 Will be deleted in version 1.2.0 Use validate() instead.
 */
Shizzle.prototype.fireValidation = function(){
  console.warn('fireValidation is deprecated since version 1.1.0 . Use validate() instead.');
  this.validateControl();
};

Shizzle.prototype.validate = function(){
  this.validateControl();
};


module.exports = Shizzle;