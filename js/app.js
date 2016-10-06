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

var templater = (function (_) {
  var tpl_display = document.querySelector('#template-contact-display');
  var compiled_display = _.template(tpl_display.textContent);
  var tpl_list = document.querySelector('#template-contact-list');
  var compiled_list = _.template(tpl_list.textContent);
  var tpl_telephone = document.querySelector('#template-telephone-number');
  var compiled_telephone = _.template(tpl_telephone.textContent);
  var tpl_address = document.querySelector('#template-address');
  var compiled_address = _.template(tpl_address.textContent);

  return {
    generate: function(type, obj) {
      var htmlStr = '';
      if (type === 'display') {
        htmlStr = compiled_display({'dataid': obj.id,
                                    'firstname': obj.firstname,
                                    'lastname': obj.lastname,
                                    'tels': obj.telephone,
                                    'adds': obj.address});
      } else if (type === 'list') {
        htmlStr = compiled_list({ 'dataid': obj.id,
                                      'firstname': obj.firstname,
                                      'lastname': obj.lastname});
      } else if (type === 'telephone') {
        htmlStr = compiled_telephone({'tele': obj.number});
      } else if (type === 'address') {
        htmlStr = compiled_address({'addstreet': obj.street,
                                    'addcity': obj.city,
                                    'addstate': obj.state});
      }
        return htmlStr;
    }
  }
})(_);

(function(exports) {
  var cd = document.querySelector('#contacts-display');
  var cl = document.querySelector('#contacts-list > ul');
  var tn = document.querySelector('#telephone-numbers');
  var ad = document.querySelector('#addresses');

  function getVal(selector) {
      return document.querySelector(selector).value
  }
  function setVal(selector, val) {
    document.querySelector(selector).value = val;
  }
  function clearForm() {
    var formInputs = document.querySelectorAll('input[type^=te]');
    _.forEach(formInputs, function(input) {
      input.value = '';
    });
  }
  function getFormValues() {
    var teleNums = document.querySelectorAll('.telephone-number');
    var teleArray = [];
    _.forEach(teleNums, function(val) {
      var num = val.querySelector('input[name="telephone"]').value;
      var typ = val.querySelector('select[name="telephone-type"]').value;
      if (num !== ''){
        teleArray.push({number: num, type: typ});
      }
    });
    var addresses = document.querySelectorAll('.address');
    var addArray = [];
    _.forEach(addresses, function(val) {
      var str = val.querySelector('input[name="address-street"]').value;
      var cit = val.querySelector('input[name="address-city"]').value;
      var sta = val.querySelector('input[name="address-state"]').value;
      var typ = val.querySelector('select[name="address-type"]').value;
      if (str !== '' && cit !== '' && sta !== ''){
        addArray.push({ street: str, city: cit, state: sta, type: typ});
      }
    });

    return {
      add: addArray,
      tel: teleArray
    }
  }
  function updateContact(contact) {
    var values = getFormValues();
    contact.firstname = getVal('input[name="firstname"]');
    contact.lastname = getVal('input[name="lastname"]');
    contact.telephone = values.tel;
    contact.address = values.add;

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
      tn.insertAdjacentHTML('beforeend', templater.generate('telephone', tel));
      tn.querySelector('.telephone-number:last-child > select').value = tel.type;
    });
    ad.innerHTML = '';
    _.forEach(contact.address, function(add) {
      ad.insertAdjacentHTML('beforeend', templater.generate('address', add));
      ad.querySelector('.address:last-child > select').value = add.type;
    });
  }
  function appendContactDisplay(contact) {
    cd.innerHTML = '';
    cd.insertAdjacentHTML('afterbegin', templater.generate('display', contact));
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
    cl.insertAdjacentHTML('beforeend', templater.generate('list', contact));
    var li = cl.querySelector('li:last-child > a');
    li.addEventListener('click',
    function(evt) {
      evt.preventDefault();
      appendContactDisplay(contact);
    },
    false);
  };

  exports.buildContact = function() {
    var values = getFormValues();
    return {
      id: _.uniqueId(),
      firstname: getVal('input[name="firstname"]'),
      lastname: getVal('input[name="lastname"]'),
      telephone: values.tel,
      address: values.add
    };
  };
}
)(this.h = {});

function makeItHappen () {
  var contact = h.buildContact();
  h.appendContactList(contact);
}

(function(){
var form = document.querySelector('#form');
form.addEventListener("submit", makeItHappen, false);
form.addEventListener("submit", function(evt) {
  evt.preventDefault();
});
})();

(function(){
var newTel = document.querySelector('#new-tel');
var tn = document.querySelector('#telephone-numbers');
newTel.addEventListener('click', function(evt) {
  tn.insertAdjacentHTML('beforeend', templater.generate('telephone', {'tele': ''}));
},
false);
})();

(function(){
var newAdd = document.querySelector('#new-add');
var ad = document.querySelector('#addresses');
newAdd.addEventListener('click', function(evt) {
  ad.insertAdjacentHTML('beforeend', templater.generate('address', {'addstreet': '', 'addcity': '', 'addstate': ''}));
},
false);
})();
