// function ready(fn) {
//   if (document.readyState != 'loading'){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }

// var contact = {
//   firstname: 'Bob',
//   lastname: 'Jones',
//   telephone: [{number:'123-123-1234'
//                type: 'mobile'}],
//   address: [{ type: 'home',
//             street: '1234 Elm Ave.',
//             city: 'Kind',
//             state: 'CA'},
//             {street: '1234 Bro St.',
//             city: 'Love',
//             state: 'NY'}]
// };

(function(exports) {
  var cd = document.querySelector('#contacts-display');
  var cl = document.querySelector('#contacts-list > ul');
  var tn = document.querySelector('#telephone-numbers');
  var ad = document.querySelector('#addresses');
  var tpl_display = document.querySelector('#template-contact-display');
  var compiled_display = _.template(tpl_display.textContent);
  var tpl_list = document.querySelector('#template-contact-list');
  var compiled_list = _.template(tpl_list.textContent);
  var tpl_telephone = document.querySelector('#template-telephone-number');
  var compiled_telephone = _.template(tpl_telephone.textContent);
  var tpl_address = document.querySelector('#template-address');
  var compiled_address = _.template(tpl_address.textContent);

  function getVal(selector) {
      return document.querySelector(selector).value
  }
  function setVal(selector, val) {
    document.querySelector(selector).value = val;
  }
  function generateID() {
    var d = new Date();
    return d.valueOf();
  }
  function clearForm() {
    var formInputs = document.querySelectorAll('input[type^=te]');
    _.forEach(formInputs, function(input) {
      input.value = '';
    });
  }
  function updateContact(contact) {
    contact.firstname = getVal('input[name="firstname"]');
    contact.lastname = getVal('input[name="lastname"]');

    var teleNums = document.querySelectorAll('.telephone-number');
    var teleArray = [];
    _.forEach(teleNums, function(val) {
      var num = val.querySelector('input[name="telephone"]').value;
      var typ = val.querySelector('select[name="telephone-type"]').value;
      teleArray.push({number: num, type: typ});
    });
    contact.telephone = teleArray;
    var addresses = document.querySelectorAll('.address');
    var addArray = [];
    var addObj = {};
    _.forEach(addresses, function(val) {
      var str = val.querySelector('input[name="address-street"]').value;
      var cit = val.querySelector('input[name="address-city"]').value;
      var sta = val.querySelector('input[name="address-state"]').value;
      var typ = val.querySelector('select[name="address-type"]').value;
      addArray.push({ street: str, city: cit, state: sta, type: typ});
    });
    contact.address = addArray;

    return contact;
  }
  function updateContactListItem(contact){
    var li = cl.querySelector('a[data-id="' + contact.id +'"]');
    li.innerHTML = contact.firstname + ' ' + contact.lastname;
  }
  function repopulateForm(contact){
    setVal('input[name="firstname"]', contact.firstname);
    setVal('input[name="lastname"]', contact.lastname);
    tn.innerHTML = '';
    _.forEach(contact.telephone, function(tel) {
      var htmlStr = compiled_telephone({'tele': tel.number});
      tn.insertAdjacentHTML('beforeend', htmlStr);
      tn.querySelector('.telephone-number:last-child > select').value = tel.type;
    });
    ad.innerHTML = '';
    _.forEach(contact.address, function(add) {
      var htmlStr = compiled_address({  'addstreet': add.street,
                                        'addcity': add.city,
                                        'addstate': add.state});
      ad.insertAdjacentHTML('beforeend', htmlStr);
      ad.querySelector('.address:last-child > select').value = add.type;
    });
  }
  function appendContactDisplay(contact) {
    cd.innerHTML = '';
    var htmlStr = compiled_display({'dataid': contact.id,
                                    'firstname': contact.firstname,
                                    'lastname': contact.lastname,
                                    'tels': contact.telephone,
                                    'adds': contact.address});
    cd.insertAdjacentHTML('afterbegin', htmlStr);
    var btn = cd.querySelector('.contact > input[value=Edit]');
    btn.addEventListener('click',
    function(evt){
      evt.preventDefault();
      var val = this.getAttribute('value');
      if (val === 'Edit') {
        repopulateForm(contact);
        this.setAttribute('value','Update');
      } else {
        contact = updateContact(contact);
        this.setAttribute('value','Edit');
        clearForm();
        updateContactListItem(contact);
        appendContactDisplay(contact);
      }
    },
    false);
  }

  exports.appendContactList = function(contact) {
    clearForm();
    var htmlStr = compiled_list({ 'dataid': contact.id,
                                  'firstname': contact.firstname,
                                  'lastname': contact.lastname});
    cl.insertAdjacentHTML('beforeend', htmlStr);
    var li = cl.querySelector('li:last-child > a');
    li.addEventListener('click',
    function(evt) {
      evt.preventDefault();
      appendContactDisplay(contact);
    },
    false);
  };

  exports.buildContact = function() {
    var teleNums = document.querySelectorAll('.telephone-number');
    var teleArray = [];
    _.forEach(teleNums, function(val) {
      var num = val.querySelector('input[name="telephone"]').value;
      var typ = val.querySelector('select[name="telephone-type"]').value;
      teleArray.push({number: num, type: typ});
    });
    var addresses = document.querySelectorAll('.address');
    var addArray = [];
    _.forEach(addresses, function(val) {
      var str = val.querySelector('input[name="address-street"]').value;
      var cit = val.querySelector('input[name="address-city"]').value;
      var sta = val.querySelector('input[name="address-state"]').value;
      var typ = val.querySelector('select[name="address-type"]').value;
      addArray.push({ street: str, city: cit, state: sta, type: typ});
    });
    return {
      id: generateID(),
      firstname: getVal('input[name="firstname"]'),
      lastname: getVal('input[name="lastname"]'),
      telephone: teleArray,
      address: addArray
    };
  };
}
)(this.h = {});

function makeItHappen () {
  var contact = h.buildContact();
  h.appendContactList(contact);
}

var form = document.querySelector('#form');

form.addEventListener("submit", makeItHappen, false);

form.addEventListener("submit", function(evt) {
  evt.preventDefault();
});

var tpl_telephone = document.querySelector('#template-telephone-number');
var compiled_telephone = _.template(tpl_telephone.textContent);
var tpl_address = document.querySelector('#template-address');
var compiled_address = _.template(tpl_address.textContent);
var tn = document.querySelector('#telephone-numbers');
var ad = document.querySelector('#addresses');

var newTel = document.querySelector('#new-tel');
newTel.addEventListener('click', function(evt) {
  var htmlStr = compiled_telephone({'tele': ''});
  tn.insertAdjacentHTML('beforeend', htmlStr);
},
false);

var newAdd = document.querySelector('#new-add');
newAdd.addEventListener('click', function(evt) {
  var htmlStr = compiled_address({  'addstreet': '',
                                    'addcity': '',
                                    'addstate': ''});
  ad.insertAdjacentHTML('beforeend', htmlStr);
},
false);
