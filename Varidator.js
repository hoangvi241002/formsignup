function Validator(options) {

    var selectorRules = {};

    // hàm thực hiện validate
    function validate(inputElement,rule) {

        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        //lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        //lặp qua từng rule và kiểm tra 
        // nếu có lỗi thì dừng
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }


        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } 
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach(function(rule){
            // lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            
            if (inputElement) {
                // Xử lý blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oniput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập vào đây'
        }
    };
}
Validator.isName = function(selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[A-Z][a-z]*$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập tên và in hoa chữ cái đầu'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập và phải là Email';
        }
    };
}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isComfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Nhập không chính xác'; 
        }
    }
}

Validator.isPhone = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập số điện thoại';
        }
    }
}

