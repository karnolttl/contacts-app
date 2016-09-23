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
//   telephone: ['123-123-1234', '111-222-3333'],
//   address: [{street: '1234 Elm Ave.',
//             city: 'Kind',
//             state: 'CA'},
//             {street: '1234 Bro St.',
//             city: 'Love',
//             state: 'NY'}]
// };

(function(exports) {
  var cd = document.querySelector('#contacts-display');
  var cl = document.querySelector('#contacts-list > ul');
  var tpl_display = document.querySelector('#template-contact-display');
  var compiled_display = _.template(tpl_display.textContent);
  var tpl_list = document.querySelector('#template-contact-list');
  var compiled_list = _.template(tpl_list.textContent);

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
    contact.telephone[0] = getVal('input[name="telephone"]');
    contact.address[0].street = getVal('input[name="address-street"]');
    contact.address[0].city = getVal('input[name="address-city"]');
    contact.address[0].state = getVal('input[name="address-state"]');
    return contact;
  }
  function updateContactListItem(contact){
    var li = cl.querySelector('a[data-id="' + contact.id +'"]');
    li.innerHTML = contact.firstname + ' ' + contact.lastname;
  }
  function repopulateForm(contact){
    setVal('input[name="firstname"]', contact.firstname);
    setVal('input[name="lastname"]', contact.lastname);
    setVal('input[name="telephone"]', contact.telephone[0]);
    setVal('input[name="address-street"]', contact.address[0].street);
    setVal('input[name="address-city"]', contact.address[0].city);
    setVal('input[name="address-state"]', contact.address[0].state);
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
    return {
      id: generateID(),
      firstname: getVal('input[name="firstname"]'),
      lastname: getVal('input[name="lastname"]'),
      telephone: [getVal('input[name="telephone"]')],
      address: [{street: getVal('input[name="address-street"]'),
                city: getVal('input[name="address-city"]'),
                state: getVal('input[name="address-state"]')}]
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
