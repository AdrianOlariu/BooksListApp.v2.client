function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function ValidateEmail(inputText)
{
    console.log('validate email input text', inputText);
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (inputText.match(validRegex)) {
        return true;
    
    } else {
    
    UI.showAlert('Email Address format invalid!','danger');
    
    return false;
    
    }
}

function validatePhoneNumber(phone){
    const desiredActivationMethod = document.querySelector('input[name="desiredActivationMethod"]:checked').value;
    console.log('validationMethod', desiredActivationMethod)
    if(desiredActivationMethod === 'phone' || phone != ''){
        console.log(phone.length);
        if(((phone.length != 10) || ((phone[0] != '4') && phone[0] != '0')) ){
            
            UI.showAlert('Phone number format invalid!','danger');
        }else{
            return;
        }
    }else{
        console.log('no phone number validation required');
    }
}

function validatePassword(password){
    console.log(password.length);
    if(((password.length < 6)) ){

        UI.showAlert('Password must have at least 7 characters!','danger');
    }else{
        return;
    }
}